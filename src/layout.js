export const masters = {
  standard: { width: 1000, height: 1000, cx: 480, cy: 430, diameter: 570, arcX: 355, arcY: 350, baseY: 790, candle: [858,815,230] },
  portrait: { width: 780, height: 1100, cx: 390, cy: 430, diameter: 570, arcX: 335, arcY: 345, baseY: 790, candle: [708,932,200] }
};
export function coordinates(master) {
  const { cx, cy, arcX, arcY, baseY } = master;
  const digits = Array.from({length:10},(_,i) => {
    const angle = Math.PI - i*Math.PI/9;
    return { action:String(i), x:cx+Math.cos(angle)*arcX, y:cy-Math.sin(angle)*arcY, size:90, digit:true };
  });
  const compact = master === masters.portrait;
  const outer=compact?282:287, inner=compact?215:225;
  return [...digits,
    {action:'+',x:cx-outer,y:cy+190,size:90}, {action:'−',x:cx-inner,y:cy+282,size:90},
    {action:'C',x:cx-110,y:baseY-14,size:90}, {action:'=',x:cx,y:baseY,size:115}, {action:'backspace',x:cx+110,y:baseY-14,size:90},
    {action:'×',x:cx+inner,y:cy+282,size:90}, {action:'÷',x:cx+outer,y:cy+190,size:90},
    ...['(','+/-',',',')'].map((action,i)=>({action,x:cx+(i-1.5)*97,y:baseY+112,size:90}))];
}
const names={'C':'Alles löschen','=':'Berechnen','backspace':'Letztes Zeichen löschen','+/-':'Vorzeichen wechseln',',':'Dezimalkomma','(':'Klammer öffnen',')':'Klammer schließen','+':'Plus','−':'Minus','×':'Mal','÷':'Geteilt durch'};
export function mountLayout(activate) {
  const artifact=document.querySelector('#artifact'), controls=document.querySelector('#controls');
  const buttons=new Map();
  for(const item of coordinates(masters.standard)) {
    const button=document.createElement('button'); button.type='button'; button.className='sphere'; button.dataset.action=item.action;
    button.setAttribute('aria-label',names[item.action]||item.action);
    const label=document.createElement('span'); label.textContent=item.action==='backspace'?'⌫':item.action==='+/-'?'±':item.action;
    button.append(label); button.addEventListener('click',()=>activate(item.action)); controls.append(button); buttons.set(item.action,button);
  }
  let current;
  function resize() {
    current=innerWidth/innerHeight<0.78?masters.portrait:masters.standard;
    const scale=Math.min(innerWidth*0.96/current.width,innerHeight*0.9/current.height);
    artifact.style.width=current.width+'px'; artifact.style.height=current.height+'px'; artifact.style.transform=`translate(-50%,-50%) scale(${scale})`;
    artifact.dataset.master=current===masters.portrait?'portrait':'standard';
    for(const img of document.querySelectorAll('.artifact-body')) {
      img.style.width='880px'; img.style.left=(current.cx-431)+'px'; img.style.top=(current.cy-293)+'px';
    }
    const orb=document.querySelector('#orb');
    Object.assign(orb.style,{left:(current.cx-current.diameter/2)+'px',top:(current.cy-current.diameter/2)+'px',width:current.diameter+'px',height:current.diameter+'px'});
    const positions=coordinates(current);
    for(const item of positions) Object.assign(buttons.get(item.action).style,{left:(item.x-item.size/2)+'px',top:(item.y-item.size/2)+'px',width:item.size+'px',height:item.size+'px'});
    const svg=document.querySelector('#supports'); svg.setAttribute('viewBox',`0 0 ${current.width} ${current.height}`);
    // Multi-pass metal relief: dark load-bearing silhouette, warm patina and a narrow reflected edge.
    const paths=positions.map(p=> {
      const target=p.digit?{x:current.cx+(p.x-current.cx)*0.79,y:current.cy+(p.y-current.cy)*0.79}:{x:current.cx+(p.x-current.cx)*0.72,y:current.baseY+12};
      return `M${p.x} ${p.y} C${p.x+(current.cx-p.x)*0.16} ${p.y+32},${target.x-12} ${target.y+18},${target.x} ${target.y}`;
    });
    svg.innerHTML='<defs><linearGradient id="metal"><stop stop-color="#17100a"/><stop offset=".23" stop-color="#876239"/><stop offset=".42" stop-color="#dfc38a"/><stop offset=".56" stop-color="#4e341b"/><stop offset=".81" stop-color="#a88750"/><stop offset="1" stop-color="#21170e"/></linearGradient></defs>'+paths.map(d=>`<path d="${d}" fill="none" stroke="#1d150e" stroke-width="12"/><path d="${d}" fill="none" stroke="url(#metal)" stroke-width="8"/><path d="${d}" fill="none" stroke="#dbca9a" stroke-opacity=".35" stroke-width="1"/>`).join('');
    const [x,y,size]=current.candle; Object.assign(document.querySelector('#candle').style,{left:(x-size/2)+'px',top:(y-size/2)+'px',width:size+'px',height:size+'px'});
  }
  addEventListener('resize',resize); resize();
  return {buttons, get master(){return current;}};
}
