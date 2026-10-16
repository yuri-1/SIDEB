// Player identity is presentation-only; retain the existing internal '你' story/save key.
const KyuuPortrait=(()=>{
 const profile=Object.freeze({name:'KYUU',adult:true,sex:'female',hair:'黑发、齐刘海',smoking:'偶尔在下班后抽烟'});
 const root=document.getElementById('kyuuAvatar'),canvas=document.getElementById('kyuuFace');
 const image=new Image();let face=0,visible=false;
 function paint(){
  const c=canvas.getContext('2d');if(!c?.clearRect||!image.complete||!image.naturalWidth)return;
  c.clearRect(0,0,80,80);c.imageSmoothingEnabled=false;const sx=Math.round(face*image.naturalWidth/5),sw=Math.round((face+1)*image.naturalWidth/5)-sx;
  // Square head crop, keeping the same framing in all five expression cells.
  c.drawImage(image,sx,0,sw,Math.min(sw,image.naturalHeight),0,0,80,80);
 }
 image.onload=paint;image.src='assets/images/characters/kyuu-avatars-v2.png';
 function sync(n,reply,text){
  visible=n[2]!=null&&!['transition','ending','end'].includes(n[3]);root.hidden=!visible;
  face=n[0]==='你'&&!reply?(/没关系|可以|坐|谢谢/.test(text)?1:/为什么|怎么|什么|？/.test(text)?2:0):0;
  if(visible)paint();
 }
 const name=who=>who==='你'?profile.name:who;
 return {profile,sync,name};
})();
