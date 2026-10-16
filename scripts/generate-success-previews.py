"""Preview-only original success cues; not imported by the running game."""
from pathlib import Path
import math
import random
import struct
import wave

RATE = 44100
DEST = Path(__file__).resolve().parents[1] / 'assets/audio/sfx/previews'
DEST.mkdir(parents=True, exist_ok=True)

for style in ['relay-success', 'glass-success']:
    rng = random.Random(161026)
    samples = []
    for frame in range(round(RATE * 1.2)):
        t = frame / RATE - .12
        value = 0.
        if style == 'relay-success':
            # Short relay response, then a restrained rising completion interval.
            for delay, freq, gain, decay in [(0, 320, .16, .028), (.075, 480, .13, .04), (.145, 640, .10, .065)]:
                u = t - delay
                if u >= 0:
                    value += gain * math.sin(2 * math.pi * freq * u) * (1 - math.exp(-u * 1600)) * math.exp(-u / decay)
            if t >= 0:
                value += .055 * rng.uniform(-1, 1) * math.exp(-t * 180)
        else:
            # Gentle glass resonance with a brief, warm confirmation note.
            for delay, freq, gain, decay in [(0, 1174.66, .15, .13), (0, 3183.33, .035, .065), (.12, 1567.98, .10, .15)]:
                u = t - delay
                if u >= 0:
                    value += gain * math.sin(2 * math.pi * freq * u) * (1 - math.exp(-u * 1400)) * math.exp(-u / decay)
        value *= min(1, max(0, (1.08 - t) / .03))
        samples.append(value)
    peak = max(abs(s) for s in samples)
    dest = DEST / (style + '-preview-v1.wav')
    with wave.open(str(dest), 'wb') as out:
        out.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        out.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, s)) * 32767)) for s in samples))
    print(f'{dest.name}: 1.2s, peak {peak:.3f}, {dest.stat().st_size} bytes')
