export class Display {
  constructor(element) {this.element=element;this.text='';}
  show(text, {animate=true,reverse=false}={}) {
    const previous=this.text; this.text=text;
    const oldPositions=[...this.element.children].map(el=>({char:el.textContent,left:el.offsetLeft}));
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
        const dx=old.left-el.offsetLeft;
        if(dx)el.animate([{transform:`translateX(${dx}px)`},{transform:'translateX(0)'}],{duration:190,easing:'ease-out'});
      } else el.animate([{opacity:0,filter:'blur(6px)'},{opacity:1,filter:'blur(0px)'}],{duration:220});
    });
  }
  cancel() { for(const animation of this.element.getAnimations({subtree:true}))animation.cancel();this.element.style.opacity='1';this.element.style.filter=''; }
  dissolve(duration=260) {return this.element.animate([{opacity:1,filter:'blur(0)'},{opacity:0,filter:'blur(10px)'}],{duration,fill:'forwards'});}
}
