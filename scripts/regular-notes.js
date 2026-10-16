// Derive known details from the saved backlog; no future facts or hidden scores.
function regularNotes(state,story,guests){
 const known=new Set(state.history.map(e=>e.text));
 const milestones=[
 [0,'s2-lan-4','最后一单收到了收件人送的橘子。她在楼下吃完才走。'],
 [0,'s2-lan-9','送纸质通知时需要拍门牌，信封只写“现使用人”。'],
 [0,'lan-roof-0','母亲曾在这栋楼做了十九年保洁。'],
 [0,'s4-lan-2','她看到封路早于现场事故，行车记录可能提供时间依据。'],
 [0,'lan-cut-2','短信里说自己安全，但请我以后通过平台联系。'],
 [1,'s2-hex-4','一直留着女儿第一次发工资买的小扳手，尺寸不对也舍不得换。'],
 [1,'s2-hex-10','凭“背侧”这个错别字认出了自己去年的故障记录。'],
 [1,'hex-report-2','旧报告写线路老化，新报告改成了非标准设备接入。'],
 [1,'hex-withdraw-2','他不愿借出别人的名字，带走了原始记录。'],
 [2,'s2-mio-4','粉色发夹是自己喜欢才继续戴的。'],
 [2,'s2-mio-10','工作结束后留下听小朋友练琴，因为曲子还没有结束。'],
 [2,'mio-notice-2','即使展示了离线模式，仍被怀疑上传家里的声音。'],
 [2,'mio-cold-4','她想先分清“需要”和“想”，没有答应再来。'],
 [2,'mio-song-4','她想自己再选一首歌，无论明天在哪里。'],
 [3,'voss-history','曾在夜班调度工作，整组人被系统替代。'],
 [3,'voss-personal-6','能调整巡查顺序，但无法改动上层的搬迁合同。'],
 [3,'voss-file-4','承诺退回一次执行单，需要两份相互独立的原始记录。'],
 [3,'s4-voss-4','复核和执行是两条流程，递交资料也可能来不及。'],
 ];
 return guests.map((g,i)=>{
  const details=milestones.filter(([who,id])=>who===i&&known.has(story.find(n=>n.id===id)?.[1])).map(row=>row[2]);
  const served=DrinkSystem.drinks.filter(d=>known.has('端上了 '+d.drink+'。')&&((i===0&&d.drink==='Silent Siren')||(i===1&&['Heavy Metal','Prism Floyd'].includes(d.drink))||(i===2&&['Blur Mirage','Velvet Underground'].includes(d.drink))||(i===3&&d.drink==='Joy Division')));
  if(!state.notes.includes(i)&&!details.length&&!served.length)return null;
  const intro=state.notes.includes(i)?g.note:served.length?'已接待：'+served.map(d=>d.drink).join('、')+'。':'从对话中记下：';
  const agreements=[[0,'warned','她答应有变化会先来通知店里。'],[0,'routeKnown','她告诉我后巷有一条不用经过识别闸机的路。'],[1,'evidence','他同意先征得住户许可，再保留维修记录。'],[2,'shelter','她把工作记录存到这里，密钥由她自己保管。'],[2,'mioAgency','我告诉她已知情况，最后的去留由她决定。'],[3,'review','店铺复核走书面流程。'],[3,'deal','我同意交出来访记录；这份决定还没有收回。']].filter(([who,flag])=>who===i&&state.flags[flag]).map(row=>row[2]);
  const later=served.filter(d=>!intro.includes(d.drink)).map(d=>'后来点过 '+d.drink+'：'+d.description);
  return {who:g.name,text:[intro,...later,...details,...agreements].join('\n\n')};
 }).filter(Boolean);
}
