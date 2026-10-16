// Original SIDE B story. Numbers and conditions are authoring data, never player UI.
function installBranching(story){
 const effects={
  'night1-10':[{trust:{LAN:2}},{trust:{LAN:0}}],
  'night1-39':[{trust:{HEX:2}},{trust:{HEX:0}}],
  'night1-54':[{trust:{MIO:1}},{trust:{MIO:2}}]
 };
 story[39]=['HEX','一个接头，算了。工具包借我放一晚，明天还得跑这边。',1,'choice',['放吧，我替你留着。','店里不方便寄存东西。'],['谢了。有人找我，你也可以留个话。','明白，我带走。']];
 const add=(id,who,text,g,type,options,replies,changes)=>{const n=[who,text,g,type,options,replies];n.id=id;story.push(n);if(changes)effects[id]=changes;return n;};
 add('n2-open','旁白','两晚后。门外多了巡查车，街道广播开始反复播放“运行安全复核”。',null);
 add('lan-warning','LAN','我今晚送的不是包裹，是清退通知。你这栋也在名单上。后巷还没封，真要走，我能带路。',0,'choice',['如果有变化，先来告诉我们。','告诉我谁收到了通知，连同名字。'],['好。我先来这里。名单上的人也该有时间收拾东西。','他们没同意让我把名字交出去。我只告诉你这家店的事。'],[{trust:{LAN:2},flags:{warned:true}},{trust:{LAN:-2}}]);
 add('hex-record','HEX','巡查报告说这栋楼的故障来自仿生人接入。可我修过配电箱，线路先坏了三年。维修记录在我手上。',1,'choice',['先征得住户同意，再留一份记录。','把所有序列号都公开，让他们没法否认。'],['这个可以。我去问他们，愿意的再留下。','里面有住户身份。你把证据和他们一起交出去了。'],[{trust:{HEX:2},flags:{evidence:true}},{trust:{HEX:-2},flags:{exposed:true}}]);
 add('mio-ask','MIO','有人要我明早去“集中检测”。通知上没有返回时间。我能把自己的工作记录存在这里吗？只给我自己看。',2,'choice',['可以。密钥由你保管。','把记录交给负责人，证明你没有问题。'],['那我明晚还能来取，对吗？……谢谢。','你也觉得，我需要先证明自己没有问题。'],[{trust:{MIO:2},flags:{shelter:true}},{trust:{MIO:-2},flags:{reported:true}}]);
 add('voss-enter','VOSS','VOSS。旧区协调处。我负责这里的商户复核。那台家政机刚走？它们能说会笑，出了事却只剩一串公司客服编号。',3);
 add('voss-history','VOSS','我以前管夜班调度。整组人被一套系统替掉，上面说是“优化”。现在出事故，要我在报告上签名。',3);
 add('voss-order','VOSS','来杯 DEADLINE。A-01，不加乳液，不加甜味，常温。我等会儿还要去下一家。',3,'drink');
 add('voss-offer','VOSS','你把非登记仿生人的来访记录交给我，我可以把这家店从优先巡查里划掉。别把做生意搞得太复杂。',3,'choice',['只谈店铺合规。请给我正式依据。','可以，来访记录交给你。','你没有资格决定谁能坐在这里。'],['你倒是很会留余地。好，走书面流程。','明早把记录备好。你会省掉不少麻烦。','那就等通知。我不会在这里跟你吵。'],[{trust:{VOSS:1},flags:{review:true}},{trust:{VOSS:2,MIO:-2,LAN:-1},flags:{deal:true,reported:true}},{trust:{VOSS:-2},flags:{confronted:true}}]);
 add('n3-open','旁白','又过了两晚。所有人都收到了一份凌晨清退安排。公告写着“统一清扫”，没有解释搬走以后住在哪里。',null);
 add('lan-return','LAN',s=>s.trust.LAN>=5?'后巷还能走。我把车留给你们，三点前得决定。':'我只收到大路封闭的消息。后巷那边，我没再去问。',0);
 add('hex-return','HEX',s=>s.trust.HEX>=5&&s.flags.evidence?'住户同意把维修记录交给复核组。我带了原件，还有一份备份。':'没有凑齐愿意署名的住户。手上这些东西，还不足以申请暂停。',1);
 add('mio-return','MIO',s=>s.trust.MIO>=5&&s.flags.shelter?'我想自己决定去哪儿。我可以整理材料，也可以跟你们走。密钥还在我这里。':'我把伞带回来了。之后……我还没想好要不要再来。',2);
 add('voss-return','VOSS',s=>s.trust.VOSS>=3&&s.flags.review&&!s.flags.reported?'你要的书面依据在这里。我能替这栋楼申请一次复核，暂停执行，最多四十八小时。你得拿得出证据。':'执行名单已经下发。我今天来，只是通知你，凌晨三点前交还门卡。',3);
 add('last-choice','你','广播又响了一遍。吧台上的四只杯子，还没有收。',null,'choice',['带着经同意的记录申请暂缓清退。','关店，和愿意同行的人走后巷。','留下配合巡查，继续经营。'],['我把记录装进防水袋，向复核窗口提交申请。','我翻过营业牌，给还坐着的人留出收拾东西的时间。','我留在店里，等巡查人员来登记。'],[{flags:{decision:'appeal'}},{flags:{decision:'leave'}},{flags:{decision:'stay'}}]);
 add('ending','SIDE B','',null,'ending');
 return {effects};
}
function resolveEnding(s){
 const t=s.trust,f=s.flags;
 if(f.decision==='appeal'&&t.HEX>=5&&t.MIO>=5&&t.VOSS>=3&&f.evidence&&f.shelter&&f.review&&!f.reported&&!f.exposed)
  return {id:'stay-of-execution',title:'STILL OPEN',text:'清退被暂缓了四十八小时。VOSS 在复核申请上签了名，HEX 把原件放进档案袋，MIO 自己决定留下作证。\n店还开着。四十八小时以后怎么办，明天再一起想。'};
 if(f.decision==='stay'&&t.VOSS>=4&&f.deal)
  return {id:'empty-seats',title:'BUSINESS AS USUAL',text:'SIDE B 留在了许可营业名单上。\nLAN 不再进门，HEX 来取走了工具包。MIO 的来访记录最后停在那个雨夜。营业额恢复了，靠窗的座位一直空着。'};
 if((f.decision==='leave'||f.decision==='appeal')&&t.LAN>=5&&t.MIO>=5&&f.warned&&f.shelter&&!f.reported)
  return {id:'another-address',title:'ANOTHER ADDRESS',text:'旧街区照常被清扫，SIDE B 没能留下。LAN 把车停在后巷，MIO 选择跟你一起走。\n几周后，你们在另一区找到一间愿意试用夜班工的新店。地址换了，蓝色杯子还在。'};
 return {id:'next-shift',title:'NEXT SHIFT',text:'凌晨三点，SIDE B 被封存。巡查灯扫过空吧台，旧街区开始统一清扫。\n你把蓝色杯子装进包里，离开这条街。清晨，你在陌生城区的招聘屏前停下：“夜班调饮员，经验不限。”\n你按下了申请。'};
}
