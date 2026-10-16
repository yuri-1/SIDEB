// Faithful finished-drink sprites. One atlas is used in the menu, mixer and serving scene.
const DrinkArt=(()=>{
 const names=['Blur Mirage','Velvet Underground','Radiohead','Prism Floyd','Purple Haze','Joy Division','Heavy Metal','Black Sabbath','Sex Pistol Shot','Silent Siren'];
 // Bounds measured from the transparent atlas, in named row-major order.
 const bounds=[[70,104,284,270],[442,68,322,305],[902,47,176,332],[1273,50,223,327],[1656,42,279,333],[80,456,259,270],[449,454,305,275],[840,445,309,281],[1295,406,183,325],[1677,402,218,337]];
 const heights=[92,100,112,112,108,84,86,89,76,114];
 const atlas=new Image(),pending=new Map();
 atlas.onload=()=>{const entries=[...pending.values()];pending.clear();for(const args of entries)draw(...args);};
 atlas.onerror=()=>pending.clear();
 atlas.src='assets/images/drinks/finished-drinks-atlas-v1.png';
 function geometry(name){
  const id=names.indexOf(name),index=id<0?5:id,[sx,sy,sw,sh]=bounds[index];
  const height=heights[index],width=Math.round(height*sw/sh),left=Math.round(80-width/2),top=126-height;
  const gripY=[90,78,81,82,76,96,95,94,105,91][index];
  // Stemmed drinks are held at the bowl, other glasses at the right body edge.
  const gripX=[1,4].includes(index)?80+width*.26:left+width-2;
  return {index,sx,sy,sw,sh,left,top,width,height,base:126,gripX,gripY};
 }
 function draw(c,name,recipe,x=0,y=0,scale=1){
  if(!c?.drawImage)return false;
  if(!atlas.complete||!atlas.naturalWidth){pending.set(c,[c,name,recipe,x,y,scale]);return false;}
  const g=geometry(name);
  c.save();c.imageSmoothingEnabled=false;c.translate(x,y);c.scale(scale,scale);
  c.drawImage(atlas,g.sx,g.sy,g.sw,g.sh,g.left,g.top,g.width,g.height);
  c.restore();return true;
 }

 return {names,draw,geometry,source:'assets/images/drinks/finished-drinks-atlas-v1.png'};
})();
