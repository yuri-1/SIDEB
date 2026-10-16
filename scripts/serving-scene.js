// One approved female right-hand sprite for every serving; never regenerate it per drink.
const ServingScene=(()=>{
 const root=document.getElementById('servingScene'),canvas=document.getElementById('servingCanvas'),label=document.getElementById('servingName');
 const handSprite=new Image(),backdrop=new Image();
 handSprite.src='assets/images/ui/kyuu-serving-hand-v2.png';backdrop.src='assets/bar-v4-clear.png';
 function hand(c,x,y,front){
  if(!c?.drawImage||!handSprite.complete||!handSprite.naturalWidth)return;
  c.save();c.imageSmoothingEnabled=false;
  // The curled upper fingers sit behind the vessel. Only thumb/palm return in front.
  if(front){c.beginPath();c.rect(x,y+67,310,217-67);c.clip();}
  c.drawImage(handSprite,449,261,1087,763,Math.round(x),Math.round(y),310,217);c.restore();
 }
 function grip(name){
  const g=DrinkArt.geometry(name);
  return {x:Math.round(146+g.gripX*1.4-69),y:Math.round(28+g.gripY*1.4-84)};
 }
 function frame(name,recipe,t){
  const c=canvas.getContext('2d');if(!c?.fillRect)return;
  c.imageSmoothingEnabled=false;const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,480,240,'#171421');
  if(backdrop.complete&&backdrop.naturalWidth){
   const w=backdrop.naturalWidth,h=backdrop.naturalHeight;
   c.drawImage(backdrop,w*.3,h*.08,w*.55,h*.63,0,0,480,101);
   rect(0,0,480,101,'#090d1a99');
   c.drawImage(backdrop,w*.18,h*.78,w*.65,h*.16,0,101,480,139);
  }else rect(0,101,480,139,'#744b43');
  rect(193,204,123,6,'#302734');rect(202,199,105,7,'#2b3544');rect(209,201,91,2,'#64787d');
  const move=Math.max(0,1-t/.58);const dx=Math.round(move*70),dy=Math.round(move*17);
  const contact=grip(name);
  const released=Math.max(0,Math.min(1,(t-.62)/.38));
  const release=Math.round((500-contact.x)*released);
  const hx=contact.x+dx+release,hy=contact.y+dy;
  hand(c,hx,hy,false);
  DrinkArt.draw(c,name,recipe,146+dx,28+dy,1.4);
  hand(c,hx,hy,true);
 }
 function play(name,recipe,done){
  let ended=false;const finish=()=>{if(ended)return;ended=true;root.close();done();};
  label.textContent=name;frame(name,recipe,0);
  try{root.showModal();}catch{finish();return;}
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?80:1100;const now=()=>typeof performance==='object'?performance.now():Date.now(),start=now();
  const tick=()=>{if(ended)return;frame(name,recipe,reduced?1:Math.min(1,(now()-start)/duration));requestAnimationFrame(tick);};requestAnimationFrame(tick);
  try{canvas.animate([{opacity:1},{opacity:1}],{duration}).finished.then(finish,finish);}catch{finish();}
 }
 root.addEventListener('cancel',e=>e.preventDefault());
 return {play,preview:frame,grip,handSource:'assets/images/ui/kyuu-serving-hand-v2.png'};
})();
