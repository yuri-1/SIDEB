// Approved C / RELAY interactions and the selected original completion cue.
(()=>{
 if(typeof Audio!=='function')return;
 const slider=document.getElementById('uiVolume'),value=document.getElementById('uiValue');let volume=35,last=0;
 try{const saved=Number(localStorage.getItem('side-b-ui-volume'));if(localStorage.getItem('side-b-ui-volume')!==null&&Number.isFinite(saved))volume=Math.max(0,Math.min(100,saved));}catch{}
 const sounds=Object.fromEntries(['confirm','select','back','error','ice','success'].map(name=>{const a=new Audio('assets/audio/sfx/relay-'+name+'-v1.wav');a.preload='auto';return [name,a];}));
 function update(){slider.value=volume;value.textContent=volume+'%';for(const audio of Object.values(sounds))audio.volume=volume/100;}
 function play(kind){if(volume===0||document.hidden)return;const now=performance.now();if(!['error','ice','success'].includes(kind)&&now-last<45)return;last=now;for(const audio of Object.values(sounds))audio.pause();const audio=sounds[kind];audio.currentTime=0;const promise=audio.play();if(promise)promise.catch(()=>{});}
 document.addEventListener('click',event=>{const control=event.target.closest?.('button,summary');if(!control||control.disabled)return;const back=['closeMix','closeMenu','closeAudio','closeReader','closeSaves','titleBtn'];if(control.closest('.ingredients')&&control.textContent==='加冰'&&control.getAttribute('aria-pressed')!=='true')return;play(control.tagName==='SUMMARY'||control.closest('.ingredients')?'select':back.includes(control.id)?'back':'confirm');},true);
 document.addEventListener('sideb:add-ice',()=>play('ice'));
 document.addEventListener('sideb:mix-error',()=>play('error'));
 document.addEventListener('sideb:mix-success',()=>play('success'));
 slider.oninput=()=>{volume=Number(slider.value);update();try{localStorage.setItem('side-b-ui-volume',String(volume));}catch{}play('select');};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const audio of Object.values(sounds))audio.pause();});update();
})();
