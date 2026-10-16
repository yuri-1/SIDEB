// Game-only fictional formulations from the supplied design, using one base per recipe.
const DrinkSystem=(()=>{
 const groups=[['基础液',[['通宁水','tonic'],['浓缩咖啡','coffee'],['辣椒汁','chili']]],['酒精',[['零酒精','none'],['朗姆酒 · 低烈度','rum'],['金酒 · 中烈度','gin'],['威士忌 · 高烈度','whisky'],['伏特加 · 极烈度','vodka']]],['碳酸',[['无气泡','still'],['微气泡','light'],['强气泡','strong']]],['温度',[['加冰','iced'],['常温','room'],['热饮','hot']]],['添加物',[['无','none'],['荧光粉','glow'],['折光极片','prism'],['可食银粉','silver'],['薄荷精油','mint']]]];
 const drinks=[
 ['Blur Mirage','低烈度','冰蓝、微甜，细小气泡像雾一样散开，悬着一点微光。',['tonic','rum','light','iced','glow']],
 ['Velvet Underground','低烈度','冷咖啡的苦底被柔软甜味包住，微微起泡，薄荷留在尾韵。',['coffee','rum','light','iced','mint']],
 ['Radiohead','低烈度','红色、带甜味的辛辣，常温，强气泡在舌尖留下电流感。',['chili','rum','strong','room','none']],
 ['Prism Floyd','中烈度','干爽草本香，冰凉清透；强气泡托起折光片，映出彩虹。',['tonic','gin','strong','iced','prism']],
 ['Purple Haze','中烈度','深红的冷饮，微气泡；薄荷先凉下来，辣味随后追上。',['chili','gin','light','iced','mint']],
 ['Joy Division','中烈度','冰冷的黑咖啡与干爽草本香，没有气泡，也没有装饰。',['coffee','gin','still','iced','none']],
 ['Heavy Metal','高烈度','常温、浓苦、烟熏，漆黑液体里卷着银色流纹，平静无泡。',['coffee','whisky','still','room','silver']],
 ['Black Sabbath','高烈度','常温，深红辛辣裹着厚重烟熏，没有气泡或额外装饰。',['chili','whisky','still','room','none']],
 ['Sex Pistol Shot','极烈度','热烈的红色短饮，酒感直接、辛辣，不起泡，不加装饰。',['chili','vodka','still','hot','none']],
 ['Silent Siren','无酒精','冰蓝、清苦，明亮微光与强气泡。想保持清醒时的选择。',['tonic','none','strong','iced','glow']],
 ].map(([drink,strength,description,target])=>({drink,strength,description,target}));
 const byName=name=>drinks.find(d=>d.drink===name);
 const oldNames={'AFTERBURN':'Silent Siren','STATIC':'Heavy Metal','SOFT RESET':'Blur Mirage','DEADLINE':'Joy Division','CIRCUIT FIZZ':'Prism Floyd','SOFT RESET / ON ICE':'Velvet Underground'};
 const defaults=()=>['tonic','none','still','room','none'];
 const valid=r=>Array.isArray(r)&&r.length===5&&r.every((v,i)=>groups[i][1].some(o=>o[1]===v));
 const label=(i,value)=>groups[i][1].find(o=>o[1]===value)?.[0]||'';
 const matches=(a,b)=>a.length===b.length&&a.every((value,i)=>value===b[i]);
 function install(story,guests){
  guests.forEach(g=>{const d=byName(oldNames[g.drink]);Object.assign(g,d);});
  guests[0].note='Silent Siren：冰蓝、强气泡与微光，无酒精。喜欢有小缺口的蓝色杯子。';guests[1].note='Heavy Metal：常温、浓苦、烟熏与银色流纹。修好了店外灯牌。';guests[2].note='第一次自己选了 Blur Mirage：冰蓝、柔和微甜、细气泡与微光。';guests[3].note='VOSS：旧区协调处负责人之一。点 Joy Division，冷咖啡、草本香，无泡、无装饰。';
  for(const n of story)if(n.drink){const d=byName(oldNames[n.drink.drink]);if(d)n.drink=d;}
  const lines={
   'night1-11':'来点冰的，让人清醒一点。气泡要足，最好是你们那杯会发光的。我等会儿还得骑车，不能碰酒。',
   'night1-12':'对，这下醒过来了。蓝杯今天先放旁边吧，我喝完这杯就走。',
   'night1-21':'我走啦。那只蓝杯先替我留着，明天还来。',
   'night1-26':'来杯重一点的。忙了一整天，今天不想喝冰的。',
   'night1-27':'酒单上有一杯黑的，烟熏味，搅起来有银色纹路。',
   'night1-28':'就它吧。别给我弄出一堆气泡，我想慢慢喝。',
   'night1-29':'嗯，是这个烟熏味。今天就该喝这个。','night1-43':'还留着烟熏味。……嗯，喝完这一口再走。',
   'night1-40':'那下次请你喝 Heavy Metal。',
   'night1-48':'想喝清透一点的，还是深色浓一点的？',
   'night1-52':'今天照顾的小朋友，把一杯冰蓝色、里面有微光的饮品打翻了。',
   'night1-54':'四十七分钟。但闻起来很好，有一点甜。我想，要是不用擦掉，应该会更好一点。',
   'night1-55':'你想试试那种感觉？',
   'night1-56':'嗯。冰凉、柔和一点，只有细细的气泡。今天已经下班了，可以有一点酒，但不要很烈。',
   's2-hex-5':'今晚想换杯冰的、干爽的，酒劲适中。气泡足一点，里面那种会折出彩虹的小片也放上。',
   's2-mio-5':'今天想试试深色的冰饮。有咖啡的苦，也有柔和甜味和一点薄荷，细气泡就好，别太烈。',
   'voss-order':'来杯冷的、黑的。咖啡味，带点干爽草本香。中等烈度，不要气泡，也不用装饰。',
  };
  for(const n of story){if(lines[n.id])n[1]=lines[n.id];else if(typeof n[1]==='string')for(const [old,name] of Object.entries(oldNames))n[1]=n[1].replaceAll(old,name);}
 }
 const responses={LAN:['这杯……你没搞错吧？我等会儿还要骑车。','我要的不是这个。没事，先别急，再想想我刚才说的。','咱们把这杯留给收工的人吧。给我重新来一杯？'],HEX:['这东西挺有想法，可我今天不是来试机油的。','杯子先放那儿。你可能把两杯的做法记串了。','不对。别一口气全换，先看最不像的那一项。'],MIO:['这和我想象的味道不太一样。是我刚才说得不清楚吗？','如果这是一杯惊喜，我可能还没学会欣赏。可以再试一次吗？','我还是想喝刚才描述的那种。这次我说具体一点。'],VOSS:['我要的不是这个。请重新做。','你没搞错吧？订单应该没有那么难理解。','杯子拿回去。我可以再等一会儿，请先确认酒单。']};
 function reject(name,attempt,recipe,target){
  const wrong=[0,1,2,3,4].filter(i=>recipe[i]!==target[i]);
  // One clue per attempt; always choose an actual mismatch, never auto-fill the recipe.
  const i=wrong[(attempt-1)%wrong.length],v=target[i];
  const hints={tonic:'我想要清透、微苦的底味，不是咖啡或辣味。',coffee:'底味应该是浓苦的咖啡。',chili:'我想要的是明显的辛辣。',none:i===1?'我还需要保持清醒，这杯不能有酒。':'装饰先省掉，我想要干净一点。',rum:'酒味柔和一点，有点甜，别太烈。',gin:'我想要适中的酒劲和干爽草本味。',whisky:'烟熏和厚重一点的酒感，才是我今天想要的。',vodka:'我想要的是酒感更直接的那种。',still:'这杯应该是平静的，不需要气泡。',light:'只要细小柔和的气泡，不要太冲。',strong:'气泡再足一点，要有舌尖发麻的感觉。',iced:'今天想喝冰的，杯里应该有冰。',room:'常温就好，别加冰，也不用加热。',hot:'这杯我想要热的。',glow:'我记得那杯里面有微光。',prism:'应该有会折出彩虹的透明小片。',silver:'我想看的是银色流纹，不是别的装饰。',mint:'最后应该留下一点薄荷的凉意。'};
  const opener=responses[name][Math.min(attempt-1,2)];const broad=['底味和我想要的不太一样。','这杯的酒感不适合我现在。','气泡的口感不太对。','温度和我想要的不一样。','装饰的味道或样子不太对。'];const hint=attempt===1?broad[i]:hints[v];return opener+' '+hint+(attempt>=3?' 先看'+groups[i][0]+'，这杯需要'+label(i,v)+'。其他的再慢慢核对。':'');
 }
 return {groups,drinks,byName,oldNames,defaults,valid,label,matches,install,reject};
})();
