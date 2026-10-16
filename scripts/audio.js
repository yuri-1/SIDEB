// Original procedural listening sketch: "Last Train / SIDE B".
// Isolated from story state and game saves. Audio starts only on an explicit click.
(()=>{
 const byId=id=>document.getElementById(id),panel=byId('audioPanel'),play=byId('audioPlay');
 const musicSlider=byId('musicVolume'),rainSlider=byId('rainVolume'),status=byId('audioStatus');
 let ctx,music,rain,master,delay,feedback,timer,noise,playing=false,pending=false,step=0,next=0;
 const beat=60/64;
 const chords=[[50,57,60,64],[46,53,57,60],[43,50,57,58],[45,52,55,59]];
 const melody=[null,69,null,76,null,null,65,null,72,null,null,69,null,64,null,null];
 const hz=n=>440*2**((n-69)/12);
 let levels={music:30,rain:15};
 try{const saved=JSON.parse(localStorage.getItem('side-b-audio-levels'));for(const k of ['music','rain'])if(Number.isFinite(saved?.[k]))levels[k]=Math.max(0,Math.min(100,saved[k]));}catch{}
 musicSlider.value=levels.music;rainSlider.value=levels.rain;
 function outputLevels(){byId('musicValue').textContent=levels.music+'%';byId('rainValue').textContent=levels.rain+'%';if(ctx){music.gain.setTargetAtTime(levels.music/100,ctx.currentTime,.15);rain.gain.setTargetAtTime(levels.rain/100*.13,ctx.currentTime,.15);}}
 function init(){
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('当前浏览器不支持音频合成。');
  ctx=new Audio();master=ctx.createGain();master.gain.value=.48;
  const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-16;compressor.ratio.value=3;master.connect(compressor);compressor.connect(ctx.destination);
  music=ctx.createGain();rain=ctx.createGain();music.connect(master);rain.connect(master);
  delay=ctx.createDelay(2);delay.delayTime.value=.47;feedback=ctx.createGain();feedback.gain.value=.25;
  const echoFilter=ctx.createBiquadFilter();echoFilter.type='lowpass';echoFilter.frequency.value=1800;delay.connect(echoFilter);echoFilter.connect(feedback);feedback.connect(delay);echoFilter.connect(music);
  const buffer=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate),data=buffer.getChannelData(0);let seed=8261;
  for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)*.45;}
  noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const rainFilter=ctx.createBiquadFilter();rainFilter.type='bandpass';rainFilter.frequency.value=1700;rainFilter.Q.value=.55;noise.connect(rainFilter);rainFilter.connect(rain);noise.start();outputLevels();
 }
 function tone(note,time,duration,volume,type='sine',detune=0){
  const osc=ctx.createOscillator(),envelope=ctx.createGain(),filter=ctx.createBiquadFilter();osc.type=type;osc.frequency.value=hz(note);osc.detune.value=detune;filter.type='lowpass';filter.frequency.value=type==='triangle'?1100:2600;
  const attack=duration>5?2.8:.05;envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(volume,time+attack);envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  osc.connect(filter);filter.connect(envelope);envelope.connect(music);envelope.connect(delay);osc.start(time);osc.stop(time+duration+.05);osc.onended=()=>{osc.disconnect();filter.disconnect();envelope.disconnect();};
 }
 function schedule(){if(!playing||ctx.state!=='running')return;let safety=0;while(next<ctx.currentTime+.55&&safety++<8){const chord=chords[Math.floor(step/16)%4];if(step%16===0)chord.forEach((note,i)=>tone(note,next+i*.07,beat*17,.043,'triangle',i%2?-4:4));if(step%8===0)tone(chord[0]-12,next,beat*6,.055);const note=melody[step%melody.length];if(note!=null)tone(note,next,beat*3,.09);step++;next+=beat;}}
 async function start(){if(pending)return;pending=true;play.disabled=true;try{if(!ctx)init();await ctx.resume();if(ctx.state!=='running')throw Error('声音未启动，请再次点击试听。');playing=true;next=ctx.currentTime+.12;schedule();clearInterval(timer);timer=setInterval(schedule,150);play.textContent='暂停试听';play.setAttribute('aria-pressed','true');status.textContent='正在播放：LAST TRAIN · 64 BPM';}catch(error){playing=false;status.textContent=error.message||'音频暂时无法播放，请重试。';}finally{pending=false;play.disabled=false;}}
 async function pause(){if(pending)return;pending=true;play.disabled=true;playing=false;clearInterval(timer);try{if(ctx)await ctx.suspend();play.textContent='播放试听';play.setAttribute('aria-pressed','false');status.textContent='已暂停';}catch{status.textContent='暂停失败，请关闭此页面停止声音。';}finally{pending=false;play.disabled=false;}}
 play.onclick=()=>playing?pause():start();byId('audioBtn').onclick=()=>panel.showModal();byId('titleAudioBtn').onclick=()=>panel.showModal();byId('closeAudio').onclick=()=>panel.close();
 for(const [slider,key] of [[musicSlider,'music'],[rainSlider,'rain']])slider.oninput=()=>{levels[key]=Number(slider.value);outputLevels();try{localStorage.setItem('side-b-audio-levels',JSON.stringify(levels));}catch{}};
 document.addEventListener('visibilitychange',()=>{if(!ctx||!playing)return;if(document.hidden){clearInterval(timer);ctx.suspend().catch(()=>{});}else ctx.resume().then(()=>{if(!playing)return;next=ctx.currentTime+.12;schedule();clearInterval(timer);timer=setInterval(schedule,150);}).catch(()=>{playing=false;play.textContent='播放试听';status.textContent='点击试听以恢复声音。';});});
 window.addEventListener('pagehide',()=>{clearInterval(timer);if(ctx)ctx.suspend().catch(()=>{});});outputLevels();
})();
