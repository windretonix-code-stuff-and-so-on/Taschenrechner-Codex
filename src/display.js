export class Display {
  constructor(element) {
    this.element=element;this.text='';
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
    if(!animate)return;
    const nodes=[...this.element.children];
    nodes.forEach((el,i)=> {
      let from=i;
      if(previous.length===9&&text.length===9)from=reverse?i-1:i+1;
      const old=oldPositions[from];
      if(old?.char===el.textContent) {
        const dx=(old.left-el.getBoundingClientRect().left)/scale;
        if(dx)el.animate([{transform:`translateX(${dx}px)`},{transform:'translateX(0)'}],{duration:190,easing:'ease-out'});
      } else el.animate([{opacity:0},{opacity:1}],{duration:220});
    });
  }
  cancel() { for(const animation of this.element.getAnimations({subtree:true}))animation.cancel();this.element.style.opacity='1'; }
  dissolve(duration=260) {return this.element.animate([{opacity:1},{opacity:0}],{duration,fill:'forwards'});}
}
