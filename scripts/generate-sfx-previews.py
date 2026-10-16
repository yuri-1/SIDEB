"""Original SFX audition packs; offline only, never imported by the game."""
import math
import random
import struct
import wave
from pathlib import Path

RATE = 44100
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/audio/sfx/previews'
EVENTS = ['confirm', 'select', 'ice', 'cup', 'back', 'error']

def tone(freq, t, decay, kind='sine'):
    phase = 2 * math.pi * freq * t
    # Smooth pulse via a short harmonic series, avoiding harsh ideal square waves.
    signal = math.sin(phase)
    if kind == 'pulse':
        signal += .24 * math.sin(phase * 3) + .09 * math.sin(phase * 5)
    return signal * (1 - math.exp(-t * 2200)) * math.exp(-t / decay)

def make_event(style, event, rng):
    length = .75 if event in ['ice', 'cup'] else .42
    samples = []
    previous = 0
    for i in range(int(RATE * length)):
        t = i / RATE
        noise = rng.uniform(-1, 1)
        click = (noise - previous * .65) * math.exp(-t * 180) * (1 - math.exp(-t * 3500))
        previous = noise
        if event == 'ice':
            value = 0
            for delay, freq in [(0, 2300), (.13, 3100), (.29, 1850)]:
                u = t - delay
                if u >= 0:
                    value += .13 * tone(freq, u, .045) + .05 * tone(freq * 1.47, u, .025)
        elif event == 'cup':
            value = .23 * tone(210, t, .025) + .10 * tone(1260, t, .10) + .10 * click
        elif style == 'terminal':
            freq = {'confirm':880, 'select':620, 'back':440, 'error':190}[event]
            freq *= 1 + (.16 if event == 'confirm' else -.12) * min(t / .09, 1)
            value = .15 * tone(freq, t, .035, 'pulse') + .035 * click
            if event == 'confirm' and t > .075:
                value += .10 * tone(1320, t - .075, .025, 'pulse')
        elif style == 'glass':
            freq = {'confirm':1174.66, 'select':880, 'back':659.25, 'error':277.18}[event]
            value = .19 * tone(freq, t, .075) + .045 * tone(freq * 2.71, t, .045)
            if event == 'confirm' and t > .09:
                value += .12 * tone(1567.98, t - .09, .09)
        else:
            freq = {'confirm':320, 'select':240, 'back':180, 'error':110}[event]
            value = .22 * tone(freq, t, .025) + .13 * click
            if event in ['confirm', 'error'] and t > .065:
                value += .12 * tone(freq * (.75 if event == 'error' else 1.5), t - .065, .03)
        # Related but distinct foley per palette.
        if event in ['ice', 'cup']:
            value *= {'terminal':.8, 'glass':1, 'relay':.7}[style]
            if style == 'relay':
                value += .07 * tone(150, t, .025)
        # Tiny room tail on glass style; no external samples.
        if style == 'glass' and t > .12 and event not in ['ice', 'cup']:
            freq = {'confirm':1174.66, 'select':880, 'back':659.25, 'error':277.18}[event]
            value += .025 * tone(freq, t - .12, .06)
        # End taper guarantees a clean file boundary.
        value *= min(1, max(0, (length - t) / .025))
        samples.append(value)
    return samples

for style in ['terminal', 'glass', 'relay']:
    rng = random.Random(27041)
    output = [0.] * (RATE * 7)
    for j, event in enumerate(EVENTS):
        offset = round((.3 + j * 1.05) * RATE)
        for i, value in enumerate(make_event(style, event, rng)):
            output[offset+i] += value
    peak = max(abs(x) for x in output)
    gain = min(1., .55 / max(peak, .001))
    path = DEST / f'{style}-audition-v1.wav'
    with wave.open(str(path), 'wb') as f:
        f.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        f.writeframes(b''.join(struct.pack('<h', round(x * gain * 32767)) for x in output))
    print(f'{path.name}: 7s, peak {peak * gain:.3f}, {path.stat().st_size} bytes')
