export class Display {
  constructor(element) {
    this.element=element;this.text='';
    this.glow=document.createElement('canvas');this.glow.width=this.glow.height=570;this.glow.style.zIndex='2';
    element.parentElement.insertBefore(this.glow,element);this.context=this.glow.getContext('2d');
  }
  paintGlow(){
    const ctx=this.context;ctx.clearRect(0,0,570,570);ctx.font='46px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#b7d3ff';ctx.shadowColor='#8298f0';ctx.shadowBlur=12;ctx.globalAlpha=.4;
    for(const el of this.element.children){const x=(570-this.element.offsetWidth)/2+el.offsetLeft+el.offsetWidth/2;ctx.fillText(el.textContent,x,285);}
  }
  points() {
    const orb=this.element.parentElement.getBoundingClientRect();
    return [...this.element.children].map(el=>{const r=el.getBoundingClientRect();return{x:(r.x+r.width/2-orb.x)/orb.width,y:.5};});
  }
  show(text, {animate=true,reverse=false}={}) {
    const previous=this.text; this.text=text;
    const scale=this.element.parentElement.getBoundingClientRect().width/this.element.parentElement.offsetWidth;
    const oldPositions=[...this.element.children].map(el=>({char:el.textContent,left:el.getBoundingClientRect().left}));
    this.element.replaceChildren();
    for(const char of text) {
      const el=document.createElement('span'); el.className='glyph'+(/[+−×÷()]/.test(char)?' optical':''); el.textContent=char;this.element.append(el);
    }
    this.paintGlow();
    if(!animate)return;
    const nodes=[...this.element.children];
    nodes.forEach((el,i)=> {
      let from=i;
      if(previous.length===9&&text.length===9)from=reverse?i-1:i+1;
      const old=oldPositions[from];
      if(old?.char===el.textContent) {
        const dx=(old.left-el.getBoundingClientRect().left)/scale;
        if(dx)el.animate([{transform:`translateX(${dx}px)`},{transform:'translateX(0)'}],{duration:190,easing:'ease-out'});
      } else el.animate([{opacity:0,filter:'blur(6px)'},{opacity:1,filter:'blur(0px)'}],{duration:220});
    });
  }
  cancel() { for(const animation of [...this.element.getAnimations({subtree:true}),...this.glow.getAnimations()])animation.cancel();this.element.style.opacity='1';this.element.style.filter=''; }
  dissolve(duration=260) {this.glow.animate([{opacity:1},{opacity:0}],{duration,fill:'forwards'});return this.element.animate([{opacity:1},{opacity:0}],{duration,fill:'forwards'});}
}
