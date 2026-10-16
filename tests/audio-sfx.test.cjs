const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
function setup(volume='35'){
 const handlers={},instances=[],slider={},value={};
 const document={hidden:false,getElementById:id=>id==='uiVolume'?slider:value,addEventListener:(name,fn)=>handlers[name]=fn};
 class Audio{constructor(src){this.src=src;this.plays=0;instances.push(this);}pause(){}play(){this.plays++;return Promise.resolve();}}
 const env={document,Audio,performance:{now:()=>100},localStorage:{getItem:()=>volume,setItem(){}},console};vm.createContext(env);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../scripts/ui-sfx.js'),'utf8'),env);
 return {handlers,instances,slider,document};
}
const h=setup();const success=h.instances.find(a=>a.src.endsWith('relay-success-v1.wav'));assert.ok(success);h.handlers['sideb:mix-success']();assert.equal(success.plays,1);assert.equal(success.volume,.35);
h.document.hidden=true;h.handlers['sideb:mix-success']();assert.equal(success.plays,1);
const mute=setup('0');mute.handlers['sideb:mix-success']();assert.equal(mute.instances.reduce((n,a)=>n+a.plays,0),0);
console.log('PASS: approved success audio routing, independent interaction volume, muted and background behavior.');
