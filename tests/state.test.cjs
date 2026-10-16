const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function harness(storage={},failWrites=false){
 const nodes={};const element=()=>({textContent:'',setAttribute(){},children:[],style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},querySelectorAll(){return this.children.flatMap(c=>c.children||[])},addEventListener(){},animate(){return {finished:{then(done){done()}}}},append(...v){this.children.push(...v)},replaceChildren(){this.children=[]},showModal(){this.open=true},close(){this.open=false},getContext(){return {save(){},restore(){},translate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){}}},hidden:false,disabled:false});
 const env={document:{dispatchEvent(){},querySelector(){return nodes.foot??=element()},getElementById(id){return nodes[id]??=element()},createElement:element},localStorage:{getItem:k=>storage[k]||null,setItem(k,v){if(failWrites)throw Error('quota');storage[k]=v}},CustomEvent:class{constructor(name){this.type=name}},Image:class{},requestAnimationFrame(){},confirm:()=>true,console};vm.createContext(env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../scripts/drinks.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../scripts/kyuu-portrait.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../scripts/regular-notes.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../scripts/drink-art.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../scripts/serving-scene.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../narrative.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../expansion.js'),'utf8'),env);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').split('<script>')[1].split('</script>')[0],env);return {run:src=>vm.runInContext(src,env),storage,nodes};
}
const h=harness();assert.equal(h.nodes.continueGame.disabled,true);h.run('newGame()');h.run(`state.i=7;render();save();writeSlot('1')`);assert.equal(h.run('state.expression'),2);h.run(`state.i=10;render();$('actions').children[0].onclick();writeSlot('2')`);assert.equal(h.run('state.expression'),1);h.run(`loadSlot('1')`);assert.equal(h.run('state.i'),7);assert.equal(h.run('state.expression'),2);h.run(`loadSlot('2')`);assert.ok(h.run('state.reply'));assert.equal(h.run('state.expression'),1);
h.run(`state.i=11;state.reply=null;state.recipe=['coffee','gin','still','iced','none'];state.mixed=true;save()`);const reloaded=harness(h.storage);assert.equal(reloaded.nodes.continueGame.disabled,false);reloaded.run(`loadSlot('auto')`);assert.equal(reloaded.run('state.mixed'),true);assert.equal(reloaded.run('state.recipe[0]'),'coffee');
h.run(`state=fresh();enterGame();let drinks=0;for(let step=0;step<150;step++){const n=story[state.i];if(n[3]==='end')break;if(n[3]==='choice'){$('actions').children[0].onclick();$('actions').children[0].onclick();}else if(n[3]==='drink'){openMix();state.recipe=DrinkSystem.defaults();for(let a=0;a<4;a++){$('mix').onclick();$('serve').onclick();}state.recipe=[...currentDrink().target];$('mix').onclick();$('serve').onclick();drinks++;}else advance();}if(drinks!==3||state.notes.length!==3||!state.fixed||story[state.i][3]!=='end')throw Error('Incomplete story');`);
const corrupt=harness({'side-b-v2-auto':'broken'});assert.equal(corrupt.nodes.continueGame.disabled,true);assert.equal(corrupt.run('getSlot("auto")'),null);const fail=harness({},true);fail.run('newGame()');assert.match(fail.nodes.saveStatus.textContent,/保存失败/);const migrated=harness({'side-b-v1':JSON.stringify(h.run('fresh()'))});assert.equal(migrated.nodes.continueGame.disabled,false);assert.ok(migrated.storage['side-b-v2-auto']);
console.log('PASS: manual slots, expression restoration, choice restoration, recipe + mixing restoration, complete story, retries without auto-fill, notes, corrupt data, storage failure, legacy migration.');

// All three sprite sheets must select the right expression cell, including after loading.
const art=harness();art.run(`
const draws=[];ctx.fillRect=()=>{};ctx.drawImage=(...args)=>draws.push(args);
portraits.forEach(p=>{p.complete=true;p.naturalWidth=2172;p.naturalHeight=724;});
for(const [guest,beat,face] of [[0,7,2],[1,26,2],[1,41,1],[2,51,3],[2,65,4],[2,70,1]]){
 state.i=beat;state.reply=null;render();draw(0);
 const call=draws[draws.length-1];
 if(call[0]!==portraits[guest]||Math.abs(call[1]-Math.round(face*2172/5))>0.001)throw Error('Wrong sprite frame: '+guest+'/'+face);
}
`);console.log('PASS: LAN / HEX / MIO sprite selection and dialogue expression frames.');

const animation=harness();animation.run(`
newGame();state.i=11;openMix();
let complete; $('cup').animate=()=>({finished:{then(done){complete=done}}});
$('mix').onclick();
if(!mixing||state.mixed||!$('serve').disabled||!$('mix').disabled)throw Error('Mix must block serving');
$('mix').onclick();
complete();
if(mixing||!state.mixed||$('serve').disabled||$('mix').disabled)throw Error('Mix completion failed');
`);console.log('PASS: shake animation blocks premature serving and restores controls on completion.');

function playRoute(choices){const h=harness();h.run('newGame()');h.run(`const route=${JSON.stringify(choices)};for(let guard=0;guard<500;guard++){const n=story[state.i];if(n[3]==='ending')break;if(state.reply){$('actions').children[0].onclick();}else if(n[3]==='choice'){const key=n.id||'night1-'+state.i;$('actions').children[route[key]??0].onclick();}else if(n[3]==='drink'){state.recipe=[...currentDrink().target];$('mix').onclick();$('serve').onclick();}else advance();}if(story[state.i][3]!=='ending')throw Error('Missing ending');`);return h;}
const good=playRoute({'night1-54':1});assert.equal(good.run('state.ending'),'stay-of-execution');
const escape=playRoute({'night1-54':1,'last-choice':1,'voss-offer':2});assert.equal(escape.run('state.ending'),'another-address');
const deal=playRoute({'voss-offer':1,'last-choice':2});assert.equal(deal.run('state.ending'),'empty-seats');
const lost=playRoute({'night1-10':1,'night1-39':1,'lan-warning':1,'hex-record':1,'mio-ask':1,'voss-offer':2,'last-choice':0});assert.equal(lost.run('state.ending'),'next-shift');
assert.equal(good.run('state.notes.includes(3)'),true);good.run("writeSlot('3')");const reload=harness(good.storage);reload.run("loadSlot('3')");assert.equal(reload.run('state.ending'),'stay-of-execution');assert.equal(reload.run('state.trust.HEX'),8);assert.equal(reload.run('state.flags.evidence'),true);
const before=good.run('state.trust.LAN');good.run("applyChoice(story[10],0)");assert.equal(good.run('state.trust.LAN'),before);
const denied=good.run("resolveEnding({...state,flags:{...state.flags,reported:true}}).id");assert.notEqual(denied,'stay-of-execution');
console.log('PASS: four reachable endings, multi-character trust gates, evidence/privacy flags, VOSS note, persistent branch state, idempotent decisions.');

const oldProgress=JSON.parse(JSON.stringify(h.run('fresh()')));delete oldProgress.trust;delete oldProgress.flags;delete oldProgress.applied;oldProgress.i=57;oldProgress.notes=[0,1];
const legacyProgress=harness({'side-b-v2-auto':JSON.stringify({version:2,state:oldProgress})});legacyProgress.run("loadSlot('auto')");assert.equal(legacyProgress.run('state.i'),57);assert.equal(legacyProgress.run('state.trust.LAN'),3);assert.equal(legacyProgress.run('state.trust.MIO'),3);
console.log('PASS: pre-relationship save migration preserves progress and completed-service trust.');

assert.equal(good.run('story.length'),237);
for(const id of ['lan-roof','hex-tape','mio-song','voss-file'])assert.equal(good.run(`state.events['${id}']`),'done');
const distant=playRoute({'night1-10':1,'night1-39':1,'lan-warning':1,'hex-record':1,'mio-ask':1,'voss-offer':2,'s4-mio-5':1,'last-choice':2});
for(const id of ['lan-cut','hex-withdraw','mio-cold','voss-lock'])assert.equal(distant.run(`state.events['${id}']`),'done');
assert.equal(good.run("state.events['mio-cold']"),undefined);
assert.equal(distant.run("state.events['mio-song']"),undefined);
const eventSave=harness();eventSave.run("newGame();state.i=story.findIndex(n=>n.id==='lan-roof-entry');state.trust.LAN=5;render();save();writeSlot('1');");
eventSave.run("state.trust.LAN=1;advance();writeSlot('2');");assert.equal(eventSave.run('story[state.i].eventId'),'lan-roof');
const eventRestored=harness(eventSave.storage);eventRestored.run("loadSlot('2')");assert.equal(eventRestored.run("state.events['lan-roof']"),'active');assert.equal(eventRestored.run('story[state.i].eventId'),'lan-roof');
eventRestored.run("for(let i=0;i<20&&story[state.i].eventId==='lan-roof';i++)advance();");assert.equal(eventRestored.run("state.events['lan-roof']"),'done');
const legacyBranch={...JSON.parse(JSON.stringify(good.run('fresh()'))),i:81};const migration=harness({'side-b-v2-auto':JSON.stringify({version:2,state:legacyBranch})});migration.run("loadSlot('auto')");assert.equal(migration.run('story[state.i].id'),'voss-order');
const visuals=harness();visuals.run("newGame();state.i=story.findIndex(n=>n.id==='s2-hex-5');state.recipe=[...currentDrink().target];openMix();");assert.equal(visuals.run('state.recipe[3]'),'iced');assert.equal(visuals.run('state.recipe[2]'),'strong');assert.match(visuals.nodes.cupDetail.textContent,/加冰.*强气泡/);
console.log('PASS: 237 authored beats, 8 high/low relationship events, conditional exclusions, active-event save restoration, stable-ID legacy migration, ice + carbonation order and feedback.');
assert.equal(good.run('state.clues.length'),6);assert.equal(good.run('new Set(story.map(n=>n.id)).size'),good.run('story.length'));
assert.equal(good.run("story.find(n=>n.id==='s2-lan-1')[2]"),0);
assert.equal(good.run("story.find(n=>n.id==='s2-mio-1')[2]"),2);
good.run("writeSlot('1')");const journalRestore=harness(good.storage);journalRestore.run("loadSlot('1')");assert.equal(journalRestore.run('state.clues.length'),6);
const untouched=harness();untouched.run("$('cluesBtn').onclick()");assert.match(untouched.nodes.readerBody.textContent,/已经听到/);
console.log('PASS: unique node IDs, customer remains visible on player lines, known-only clue journal and journal save restoration.');

assert.equal(h.run('DrinkSystem.drinks.length'),10);assert.equal(h.run('new Set(DrinkSystem.drinks.map(d=>d.target.join("|"))).size'),10);assert.equal(h.run('DrinkSystem.drinks.every(d=>DrinkSystem.valid(d.target))'),true);
for(const [guest,beat] of [[0,11],[1,28],[2,56],[3,'voss-order']]){const flow=harness();flow.run(`newGame();state.i=${typeof beat==='number'?beat:`story.findIndex(n=>n.id==='${beat}')`};render();const originalI=state.i,originalTrust=JSON.stringify(state.trust),originalFlags=JSON.stringify(state.flags);for(let attempt=0;attempt<6;attempt++){state.recipe=DrinkSystem.defaults();$('mix').onclick();if($('resultName').textContent!=='一杯神秘液体'||$('serve').disabled)throw Error('Mystery must be servable');$('serve').onclick();if(state.i!==originalI||JSON.stringify(state.trust)!==originalTrust||JSON.stringify(state.flags)!==originalFlags)throw Error('Wrong drink changed plot or trust');if(state.reply!==null||!state.reaction)throw Error('Rejection needs separate dialogue state');}if(state.attempts[orderKey()]!==6)throw Error('Retry counter');writeSlot('1');`);const saved=harness(flow.storage);saved.run("loadSlot('1')");assert.ok(saved.run('reactionForNode()'));saved.run("state.recipe=[...currentDrink().target];$('mix').onclick();$('serve').onclick();");assert.equal(saved.run('state.reaction'),null);}
const menu=harness();menu.run("newGame();state.i=11;state.recipe=['chili','gin','light','iced','mint'];showDrinkMenu();");assert.equal(menu.nodes.drinkCards.children.length,10);assert.equal(menu.run('state.recipe[0]'),'chili');assert.ok(!fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').includes('id="assist"'));
const oldMix={...h.run('fresh()'),i:11,recipe:['A-01',false,true,'热饮',false],mixed:true};const converted=harness({'side-b-v2-auto':JSON.stringify({version:2,state:oldMix})});converted.run("loadSlot('auto')");assert.equal(converted.run('state.i'),11);assert.equal(converted.run('state.mixed'),false);assert.equal(converted.run('DrinkSystem.valid(state.recipe)'),true);assert.match(converted.nodes.saveStatus.textContent,/材料体系已更新/);
console.log('PASS: 10 unique valid drinks, 6 wrong servings for all 4 characters, no plot/trust changes, rejection save restoration, successful recovery, menu without auto-fill, old-material migration.');

const journal=harness();assert.equal(journal.run('regularNotes(state,story,guests).length'),0);
journal.run("state.notes=[0];log('LAN',story.find(n=>n.id==='s2-lan-4')[1]);");assert.match(journal.run('regularNotes(state,story,guests)[0].text'),/橘子/);assert.doesNotMatch(journal.run('regularNotes(state,story,guests)[0].text'),/十九年/);
journal.run("state.i=story.findIndex(n=>n.id==='lan-cut-2');render();");assert.equal(journal.nodes.smsScene.hidden,false);assert.match(journal.nodes.smsCaption.textContent,/平台联系/);assert.equal(journal.nodes.smsMessages.children.length,3);journal.run('writeSlot("1");');const smsReload=harness(journal.storage);smsReload.run('loadSlot("1")');assert.equal(smsReload.nodes.smsScene.hidden,false);
console.log('PASS: progressive notes avoid future spoilers; SMS presentation and save restoration.');
// Ingredient feedback must emit ice only when newly adding it, never on rerender.
const iceFeedback=harness();iceFeedback.run(`const cues=[];document.dispatchEvent=e=>cues.push(e.type);state.i=11;openMix();const temp=$('ingredients').children[3];temp.children[1].onclick();if(cues.join()!=='sideb:add-ice')throw Error('Missing ice cue');$('ingredients').children[3].children[1].onclick();if(cues.length!==1)throw Error('Repeated ice click should not duplicate cue');`);
// Keep rain inside the sloping window, with a restored canvas transform afterward.
const rainCheck=harness();rainCheck.run(`const paths=[];ctx.save=()=>paths.push('save');ctx.restore=()=>paths.push('restore');ctx.clip=()=>paths.push('clip');ctx.fillRect=()=>{};drawWindowRain(400);if(paths.join()!=='save,clip,restore')throw Error('Rain must be clipped and restored');`);
console.log('PASS: ice addition cue, duplicate suppression, window rain clipping.');

const successCue=harness();successCue.run(`const mixCues=[];document.dispatchEvent=e=>mixCues.push(e.type);state.i=11;openMix();state.recipe=DrinkSystem.defaults();$('mix').onclick();if(mixCues.includes('sideb:mix-success'))throw Error('Wrong mix must stay silent');state.recipe=[...currentDrink().target];$('mix').onclick();if(mixCues.filter(v=>v==='sideb:mix-success').length!==1)throw Error('Correct mix needs one success cue');finishMix();openMix();save();if(mixCues.filter(v=>v==='sideb:mix-success').length!==1)throw Error('Completion callback or reopen repeated cue');`);
console.log('PASS: selected success cue occurs once on correct completion, never on wrong result or reopening.');

const servingLock=harness();servingLock.run(`state.i=11;state.recipe=[...currentDrink().target];state.mixed=true;const initialI=state.i;let endServing;$('servingCanvas').animate=()=>({finished:{then(done){endServing=done;}}});$('serve').onclick();if(!serving||state.i!==initialI||!$('serve').disabled)throw Error('Serving advanced too soon');$('serve').onclick();endServing();if(serving||state.i!==initialI+1)throw Error('Serving did not commit');const once=state.i;endServing();if(state.i!==once)throw Error('Double completion');`);
assert.equal(servingLock.run('DrinkArt.names.length'),10);assert.equal(servingLock.run('ServingScene.handSource'),'assets/images/ui/kyuu-serving-hand-v2.png');
console.log('PASS: serving waits for animation, blocks repeated serving, commits exactly once; shared hand asset and 10 finished drinks.');

const kyuu=harness();kyuu.run('state.i=13;render();');assert.equal(kyuu.nodes.speaker.textContent,'KYUU');assert.equal(kyuu.nodes.kyuuAvatar.hidden,false);assert.equal(kyuu.run("KyuuPortrait.profile.sex"),'female');kyuu.run('state.i=0;render();');assert.equal(kyuu.nodes.kyuuAvatar.hidden,true);assert.equal(kyuu.run("KyuuPortrait.name('你')"),'KYUU');assert.equal(kyuu.run('DrinkArt.source'),'assets/images/drinks/finished-drinks-atlas-v1.png');
console.log('PASS: KYUU identity and guest-dialogue avatar without changing the internal player/save key; approved drink and shared-hand asset routing.');

const contact=harness();contact.run(`for(const name of DrinkArt.names){const g=DrinkArt.geometry(name),p=ServingScene.grip(name);if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||g.gripY<g.top||g.gripY>g.base)throw Error('Invalid grip');}if(ServingScene.grip('Velvet Underground').y===ServingScene.grip('Silent Siren').y)throw Error('Different silhouettes require distinct contact heights');`);
console.log('PASS: glass-specific contact anchors and integer sprite-cell sampling.');
