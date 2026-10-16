// Authored continuous shifts and relationship scenes. Stable IDs are save anchors.
function expandNarrative(story,narrative){
 const legacy=story.map((n,i)=>n.id||'night1-'+i);
 story.forEach((n,i)=>{n.id ||= 'night1-'+i;n.chapter=i<75?'OPENING':i>=story.findIndex(b=>b.id==='n3-open')?'LAST CALL':'PAPER TRAIL';});
 const B=(id,who,text,g=null,type,opts,replies,changes,extra={})=>{const n=[who,text,g,type,opts,replies];Object.assign(n,{id,chapter:'PAPER TRAIL'},extra);if(changes)narrative.effects[id]=changes;return n;};
 const sequence=(prefix,rows,chapter,location)=>{let guest=rows.find(r=>r[2]!=null)?.[2]??null;return rows.map((r,i)=>{if(r[2]!=null)guest=r[2];return B(prefix+'-'+i,r[0],r[1],guest,r[3],r[4],r[5],r[6],{chapter,location,face:r[7]??(r[0]==='你'||r[0]==='旁白'?undefined:0)});});};
 const before=(id,nodes)=>{const i=story.findIndex(n=>n.id===id);if(i<0)throw Error('Missing story anchor '+id);story.splice(i,0,...nodes);};
 const after=(id,nodes)=>{const i=story.findIndex(n=>n.id===id);if(i<0)throw Error('Missing story anchor '+id);story.splice(i+1,0,...nodes);};
 const event=(id,condition,title,subtitle,rows,chapter,location,flag)=>{
  const nodes=[B(id+'-entry','旁白',subtitle,null,'transition',null,null,null,{title,chapter,location}),...sequence(id,rows,chapter,location)];
  nodes.forEach(n=>{n.eventId=id;n.when=s=>s.events?.[id]==='active'||(s.events?.[id]!=='done'&&condition(s));});
  nodes[nodes.length-1].eventEnd=true;if(flag)nodes[nodes.length-1].grantFlag=flag;return nodes;
 };
 // The second shift pays off first-night details before revealing the investigation.
 before('n2-open',[
  B('shift2','旁白','次日，22:17。雨小了，窗沿还在滴水。蓝杯放在你伸手就能拿到的地方。',null,'transition',null,null,null,{title:'LATE ARRIVAL',chapter:'LATE ARRIVAL'}),
  ...sequence('s2-lan',[
   ['LAN','你真的把这只杯子留出来了。',0],['你','缺口朝外，免得喝的时候碰到。'],['LAN','我以前没发现。前任店主每次都这么放，原来不是巧合。',0],
   ['你','昨晚最后那单送到了？'],['LAN','到了。孩子睡着了，收件人在门缝里比了个“谢谢”。我收到了一袋橘子。',0],['你','小费？'],['LAN','他说快坏了，帮忙处理。结果特别甜。我在楼下吃完才走。',0],
   ['LAN','今天平台让我送一批纸质通知。电子签收不算，要拍门牌。',0],['你','什么通知？'],['LAN','封着的。我没拆。可是每一封，收件人都写“现使用人”。连名字都省了。',0],
   ['LAN','晚点能借一下你的充电口吗？旧电池一到雨天就掉电。',0,'choice',['插这里，线别绊着你。','先把车挪远点，别影响店里。'],['谢了。我坐里面，不挡人。','好。我找别的地方充。'],[{flags:{charger:true}},{trust:{LAN:-1}}]],
  ],'LATE ARRIVAL'),
  ...event('lan-roof',s=>s.trust.LAN>=5,'RAIN CHECK','22:46 · 后门屋檐。LAN 没有立刻骑走。',[
   ['LAN','我第一次跑这条街，是替我妈送钥匙。她在这栋楼做了十九年保洁。',0],['你','她现在还住这边？'],['LAN','搬走了。房租涨的时候，她说新房子离医院近。后来我才知道，新房子根本没有窗。',0],['LAN','有一天真要搬，你先给我十分钟。我知道哪条路不用经过识别闸机。',0],['你','我记着。不是现在就走。'],['LAN','我知道。先把橘子拿进去，别淋坏了。',0]
  ],'LATE ARRIVAL','backdoor','routeKnown'),
  ...sequence('s2-hex',[
   ['HEX','工具包还在？我一整天总觉得手里少点东西。',1],['你','在吧台下面。'],['HEX','上层那把小扳手别动，柄上的胶没干。修了十几年，还是嫌它硌手。',1],['你','为什么不换新的？'],['HEX','我女儿第一次拿工资买的。尺寸买错了，我磨过两次。她一直以为特别好用。',1],
   ['HEX','今晚给我换杯有冰、有气的。A 底，不加奶，不加甜味。嘴里全是金属味。',1,'drink'],['HEX','这才像下班。刚才我见到巡检的人，拿着一张新的故障汇总表。',1],['你','哪里新？'],['HEX','日期新。里面那三个故障点，我去年就报过。连错别字都没改。',1],['你','怎么知道还是那张？'],['HEX','“北侧”写成了“背侧”。我写的。字丑，印象深。',1],
  ],'LATE ARRIVAL'),
  ...sequence('s2-mio',[
   ['MIO','我今天没有打翻任何东西，所以准时下班了。',2],['你','发夹也是今天戴的？'],['MIO','上周买的。有人说粉色适合家政型号。我本来想换掉。',2],['你','那你喜欢它吗？'],['MIO','喜欢。于是今天又戴了。',2],
   ['MIO','你可以给我一杯加冰的 N 底加 M-2 吗？不加糖，也不要气泡。我想知道冰慢慢化掉是什么感觉。',2,'drink'],['MIO','杯子外面会有水。我以前会立刻擦掉。今天想先看一会儿。',2],
   ['你','今天的小朋友呢？'],['MIO','她问我，为什么清洁结束以后我还不走。因为我在听她练琴。任务已经结束了。',2],['你','你怎么回答？'],['MIO','我说这首曲子还没结束。她就从头弹了一遍。',2],
  ],'LATE ARRIVAL'),
  B('s2-close','旁白','你收起两只湿杯垫。门外最后一个快递箱上，印着与巡检文件相同的三角标识。',null,'transition',null,null,null,{title:'PAPER TRAIL',chapter:'PAPER TRAIL'}),
 ]);
 story.find(n=>n.id==='n2-open')[1]='再下一班，23:40。LAN 把一份已经拆封的通知摊在吧台上。你认出了那枚三角标识。';
 before('lan-warning',sequence('notice-talk',[
  ['你','这就是要拍门牌的那批？'],['LAN','有个老人眼睛不好，让我替他念。念到第三行，他把自己的椅子搬出来，说那我坐哪里。',0],['你','上面怎么写的？'],['LAN','“暂停使用，另行安置”。他问我另行是哪里，我没答上来。',0],
 ],'PAPER TRAIL'));
 before('hex-record',sequence('hex-report',[
  ['HEX','他们不是把故障写错了。他们把起因那一栏换了。',1],['你','原来写的什么？'],['HEX','“绝缘层老化，等待预算”。现在写“非标准设备接入”。',1],['你','谁换的？'],['HEX','签名不是同一个人。别急着指人，先把两个版本放一起看。',1]
 ],'PAPER TRAIL'));
 after('hex-record',event('hex-tape',s=>s.trust.HEX>=5&&s.flags.evidence,'BACKUP','00:08 · 店内断电了六秒。HEX 摸黑找到了配电柜。',[
  ['HEX','别开主灯。先看看窗外，哪几栋也灭了。',1],['你','有三栋。都在清退名单上。'],['HEX','这就是为什么我要保留纸本。停电的时候，总得有什么还能读。',1],['HEX','年轻时我也签过“临时停用”。以为修完就让人回来。最后楼卖了，纸还留在我这里。',1],['你','这次你想怎么办？'],['HEX','先别再替他们省略“谁同意的”那一页。',1]
 ],'PAPER TRAIL','blackout','backupWitness'));
 before('mio-ask',sequence('mio-notice',[
  ['MIO','今天有人在孩子面前问，我会不会把家里的声音上传。',2],['你','你怎么回答？'],['MIO','我展示了离线模式。她还是把钢琴盖上了。',2],['MIO','小朋友没有说话。她只是把凳子往旁边挪，给我留了一点位置。',2]
 ],'PAPER TRAIL'));
 after('mio-ask',event('mio-cold',s=>s.trust.MIO<=2,'RETURN RECEIPT','00:22 · 风铃响过以后，门又轻轻开了。',[
  ['MIO','我来拿昨天忘在这里的杯垫。',2],['你','那是店里的，可以留给你。'],['MIO','不用了。今天我会把自己的东西都带走。',2],['你','你还会回来吗？'],['MIO','如果需要。我想先分清需要和想。',2]
 ],'PAPER TRAIL','doorway','mioDistance'));
 after('voss-history',sequence('voss-personal',[
  ['你','你也被替代过，为什么还替那份报告签字？'],['VOSS','我不签，明天有人替我签。区别是我还能给一些商户留时间。',3],['你','包括家政仿生人？'],['VOSS','包括真正住在这里的人。',3],['你','那句话里的“真正”，由谁填？'],['VOSS','你以为我没问过？我问过。得到的答复也是一张表。',3],['VOSS','别把我想得太有权。我能调巡查顺序，动不了上面的搬迁合同。',3]
 ],'PAPER TRAIL'));
 after('voss-offer',[
  ...event('voss-lock',s=>s.trust.VOSS<=2,'SEALED NOTICE','01:04 · VOSS 走出门，隔着玻璃拨了一通电话。',[
   ['旁白','五分钟后，店铺终端收到一份补充巡查通知。受理时间是今晚，申请时间却是昨天下午。'],['你','这份通知在他进店之前就准备好了。'],['LAN','所以他给的不是机会。是让你自己选理由。',0],['你','他还是可以提前执行。'],['LAN','那就别只等他改变主意。',0]
  ],'PAPER TRAIL','notice','earlyInspection'),
  ...event('voss-file',s=>s.trust.VOSS>=4&&s.flags.review&&!s.flags.deal,'UNSIGNED','01:09 · 门外，VOSS 没把资料夹合上。',[
   ['VOSS','看第七页。只看，不拍住户姓名。',3],['你','这不是事故处理，是先安排清退，再等复核。'],['VOSS','合同要求空置率。我没有签合同，但执行单上有我的名字。',3],['你','你能做什么？'],['VOSS','退回一次。需要两个相互独立的原始记录。再多，我没有办法承诺。',3],['你','那就从你能承诺的开始。']
  ],'PAPER TRAIL','doorway','reviewDetails'),
 ]);
 // A complete fourth shift lets testimony contradict the official account.
 before('n3-open',[
  B('shift4','旁白','次晚，23:06。收音机突然只剩杂音，三分钟后恢复。新闻里没有提到这次中断。',null,'transition',null,null,null,{title:'DEAD AIR',chapter:'DEAD AIR'}),
  ...sequence('s4-lan',[
   ['LAN','今天平台改了路。让我绕开学校，理由是“用户安全”。',0],['你','那里发生了什么？'],['LAN','什么也没发生。警戒线比第一辆车早到了半小时。',0],['LAN','我有带时间戳的行车记录。里面还拍到了我闯单行道，真丢人。',0,'choice',['只留需要的片段，原件由你保管。','那就算了，别把自己卷进去。'],['好。我把时间和路线标给你。那段单行道也留着，省得有人说我剪过。','也好。我今晚照常送单。'],[{flags:{routeEvidence:true}},{trust:{LAN:-1}}]],
   ['你','昨晚那个老人呢？'],['LAN','他把椅子放回屋里了。说要留给外孙，车装不下。',0],['LAN','我骗他说我的车大。现在真得想办法借辆大的。',0]
  ],'DEAD AIR'),
  ...event('lan-cut',s=>s.trust.LAN<=2,'MISSED CALL','23:38 · 后门的充电线空着。',[
   ['旁白','LAN 发来一条短讯：“车我挪走了。”没有附定位。'],['你','你问她是否安全。隔了很久，消息才显示送达。'],['LAN','安全。以后工作上的事，平台联系就好。',0],['旁白','你把充电线绕好，放回抽屉。']
  ],'DEAD AIR','sms','lanDistance'),
  ...sequence('s4-hex',[
   ['HEX','我女儿打电话，让我别再碰这些东西。',1],['你','她担心你。'],['HEX','嗯。她在新城做数据合规。她说纸本证明不了系统里不存在的版本。',1],['你','你怎么说？'],['HEX','我说你买的扳手也不符合规格。她骂了我十分钟，最后帮我查了受理窗口。',1],['HEX','我会去问愿意署名的人。至于没同意的人，你能替他们保留空白吗？',1,'choice',['保留。没有同意就不写名字。','只有把人数凑够，事情才有用。'],['好。空白也是他们自己选的。','你和填那张清退表的人，开始说同一种话了。'],[{flags:{consentKept:true}},{trust:{HEX:-2},flags:{exposed:true}}]]
  ],'DEAD AIR'),
  ...event('hex-withdraw',s=>s.trust.HEX<=2,'NO SIGNATURE','00:02 · 工具包重新放到了门边。',[
   ['HEX','钥匙放回杯子下面了。',1],['你','不再留一晚？'],['HEX','工具可以借。别人的名字，我借不起。',1],['旁白','他带走了原始记录，只留下店铺电路的维修单。']
  ],'DEAD AIR','doorway','hexDistance'),
  ...sequence('s4-mio',[
   ['MIO','小朋友今天给我弹完了整首曲子。她妈妈在门口等，没有催。',2],['你','你们和好了？'],['MIO','我不知道。临走时她问，明天还是你来吗。我没答应。',2],['你','因为检测通知？'],['MIO','也因为我第一次想知道，如果有一天我不去，会不会有人找我。',2],['MIO','你觉得我应该留下，还是走？',2,'choice',['我会告诉你我知道的情况，最后由你决定。','你留下，我替你决定比较安全。'],['那请把所有情况都告诉我。包括你害怕的部分。','你也在替我安排一个位置，只是换了张桌子。'],[{flags:{mioAgency:true}},{trust:{MIO:-2}}]]
  ],'DEAD AIR'),
  ...event('mio-song',s=>s.trust.MIO>=5&&s.flags.shelter,'OFF THE CLOCK','00:31 · 你关掉了营业广播，留下收音机的本地频道。',[
   ['MIO','这一段，是她今天弹的。中间那个音，每次都会慢一点。',2],['你','你想点同一首？'],['MIO','我想让它播完。不用为了下一位客人跳过去。',2],['旁白','整段音乐结束前，MIO 没再整理桌上的杯垫。'],['MIO','明天不管在哪里，我想自己再选一首。',2]
  ],'DEAD AIR','quiet','mioSong'),
  ...sequence('s4-voss',[
   ['VOSS','明天的执行单到了。我今天不喝东西。',3],['你','昨天你说的是复核。'],['VOSS','复核没有撤掉执行。它们一直是两条流程。',3],['你','资料交上去，也可能来不及？'],['VOSS','对。你应该早点问，我也应该早点说。',3],['你','你现在还把 MIO 当作设备吗？'],['VOSS','我还没想好怎么改那一栏。但明天签字的时候，我知道你在问什么。',3]
  ],'DEAD AIR'),
  B('s4-close','旁白','广播恢复了，清退名单开始按楼号播报。你终于听到了 SIDE B 的门牌。',null,'transition',null,null,null,{title:'LAST CALL',chapter:'LAST CALL'}),
 ]);
 story.find(n=>n.id==='n3-open')[1]='凌晨，02:20。没有人说“晚上好”。每个人都先看了一眼门外停着的巡查车。';
 before('lan-return',sequence('s5-table',[
  ['你','杯子还没收。先坐下。'],['LAN','车没熄火，我就站一会儿。',0],['MIO','我今天带了自己的包。',2],['HEX','那就把资料放在最上面，别让杯子压着。',1],['你','你们听到了最后的时间？'],['LAN','三点。广播念了四遍。',0]
 ],'LAST CALL'));
 after('hex-return',sequence('s5-crosscheck',[
  ['你','维修记录、现场时间和清退通知，能对得上吗？'],['HEX',s=>s.flags.routeEvidence?'LAN 拍到的封路时间，比报告里的事故时间早。两份记录不是同一个来源。':'维修记录能证明线路老化。但现场封路时间，我没有独立记录。',1],['VOSS','材料会进入复核卷宗。能不能及时暂停，我要把原件送到值班处才知道。',3],['你','这次别省略后半句。'],['VOSS','……我会要求回执。',3]
 ],'LAST CALL'));
 before('last-choice',sequence('s5-lasttalk',[
  ['LAN',s=>s.flags.routeKnown?'我说过给我十分钟。现在还有。':'如果要走，先确认出口。我不想再对任何人说“应该能过”。',0],['MIO',s=>s.flags.mioSong?'那首曲子我记住了。杯子拿不走也没关系。':'我把借的伞放在门口了。如果留下，也不用因为还伞。',2],['HEX','你不用在这里证明自己是个好人。决定以后，把没做完的事也算进去。',1],['你','没有人再催我点单。门口的风铃被风吹响了一次。']
 ],'LAST CALL'));
 const cold=story.filter(n=>n.eventId==='mio-cold');for(let i=story.length-1;i>=0;i--)if(story[i].eventId==='mio-cold')story.splice(i,1);after('s4-mio-5',cold);
 const hexDrink=story.find(n=>n.id==='s2-hex-5');hexDrink.drink={drink:'CIRCUIT FIZZ',order:'A-01 · 加冰 · 气泡 · 无 M-2 · 无 S-1',target:['A-01',false,false,'加冰',true]};
 const mioDrink=story.find(n=>n.id==='s2-mio-5');mioDrink.drink={drink:'SOFT RESET / ON ICE',order:'N-03 · M-2 · 加冰 · 无 S-1 · 无气泡',target:['N-03',true,false,'加冰',false]};
 const faces={'s2-lan-0':1,'s2-lan-6':1,'s2-hex-2':1,'s2-hex-4':1,'s2-mio-0':1,'s2-mio-4':1,'s2-mio-6':3,'s2-mio-10':1,'hex-report-0':4,'mio-notice-0':2,'mio-notice-2':4,'s4-lan-0':2,'s4-hex-0':2,'s4-hex-5':1,'s4-mio-0':1,'s4-mio-4':4,'voss-personal-1':4,'voss-personal-3':0,'mio-cold-0':4,'mio-cold-2':2,'mio-cold-4':4,'mio-song-0':1,'mio-song-2':4,'mio-song-4':1,'hex-tape-0':0,'hex-tape-3':4,'lan-roof-0':4,'lan-roof-3':0,'lan-roof-5':1};for(const [id,face] of Object.entries(faces)){const n=story.find(n=>n.id===id);if(n)n.face=face;}
 const clues=[
 {id:'nameless',beat:'s2-lan-10',title:'没有名字的通知',text:'LAN 看到通知只写“现使用人”，配送却要求拍摄门牌。她没有拆开其他人的信。'},
 {id:'old-error',beat:'s2-hex-10',title:'同一个错别字',text:'HEX 认出了旧故障表上的“背侧”。新报告沿用了旧记录，却换了归因。'},
 {id:'changed-cause',beat:'hex-report-4',title:'被改写的起因',text:'HEX 称旧版写“绝缘层老化”，新版写“非标准设备接入”。两个版本的签名不同，尚不能只凭签名确定谁修改。'},
 {id:'blank-return',beat:'mio-ask',title:'没有返回时间',text:'MIO 收到集中检测通知，通知没有写明返回时间。她要求自己保管工作记录的密钥。'},
 {id:'vacancy',beat:'voss-file-2',title:'先空置，再复核',text:'你在 VOSS 的第七页看见了空置率要求。清退执行与复核是两条流程，并非先复核才执行。'},
 {id:'early-cordon',beat:'s4-lan-3',title:'警戒线早于事故',text:'LAN 称现场提前封路，愿意保留带时间戳的原始行车记录；记录含有她的交通违规，不能只公开有利片段。'},
 ];for(const clue of clues){const n=story.find(n=>n.id===clue.beat);if(n)n.clueId=clue.id;}
 return {legacy,clues};
}
