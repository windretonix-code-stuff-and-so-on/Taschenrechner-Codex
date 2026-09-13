import { LAUGH_ONSETS,LAUGH_DURATION } from './audio.js';
export class AnimationController {
  constructor({display,smoke,audio,wizard,onErrorEnd}){Object.assign(this,{display,smoke,audio,wizard,onErrorEnd});this.generation=0;this.frame=0;this.mode='idle';}
  cancel(){
    this.generation++;cancelAnimationFrame(this.frame);this.frame=0;this.mode='idle';this.display.cancel();this.audio.stop();this.wizard.style.opacity='0';this.wizard.style.backgroundPosition='0 0';this.smoke.mode='idle';
  }
  clear(){this.cancel();this.smoke.reset();this.display.show('',{animate:false});}
  input(text,hidden,effect){
    const previousPoints=this.display.points();
    this.cancel();this.smoke.setHidden(hidden);this.display.show(text,{animate:false,reverse:effect.reverse});
    const nextPoints=this.display.points();
    if(effect.delta){const points=effect.delta<0?nextPoints:previousPoints;for(const p of points.slice(0,Math.abs(effect.delta)))this.smoke.burst(p.x,p.y,15,effect.delta<0);}
    else if(text){const p=nextPoints.at(-1);if(p)this.smoke.burst(p.x,p.y,5);}
  }
  result(text){
    this.cancel();this.mode='result';this.smoke.mode='result';this.smoke.energy=1;this.smoke.setHidden(0);this.display.dissolve();
    for(const p of this.display.points())this.smoke.burst(p.x,p.y,12);
    const generation=this.generation,start=performance.now();let materialized=false;
    const tick=now=>{
      if(generation!==this.generation)return;
      const elapsed=now-start;
      if(elapsed>420&&elapsed<1050)this.smoke.energy=1.2;
      if(elapsed>=1100&&!materialized){materialized=true;this.display.cancel();this.display.show(text);this.smoke.burst(.5,.5,28,true);this.mode='settling';}
      if(elapsed>=1400){this.mode='idle';this.smoke.mode='idle';this.frame=0;return;}
      this.frame=requestAnimationFrame(tick);
    };this.frame=requestAnimationFrame(tick);
  }
  error(){
    this.cancel();this.mode='error';this.smoke.mode='error';this.smoke.energy=1.5;this.smoke.setHidden(0);this.display.dissolve(180);this.smoke.burst(.5,.65,65);
    const generation=this.generation,start=performance.now();let nextLaugh=0;
    const tick=now=>{
      if(generation!==this.generation)return;
      const elapsed=now-start;
      if(elapsed>=3500){this.clear();this.onErrorEnd();return;}
      const emerge=Math.max(0,Math.min(1,(elapsed-240)/500)),dissolve=Math.min(1,Math.max(0,(3500-elapsed)/650));
      this.wizard.style.opacity=String(emerge*dissolve*.9);this.smoke.energy=elapsed<2850?1.1:.7;
      if(nextLaugh<3&&elapsed>=LAUGH_ONSETS[nextLaugh]){if(elapsed<LAUGH_ONSETS[nextLaugh]+LAUGH_DURATION)this.audio.laugh();nextLaugh++;}
      let frame=0;
      for(const onset of LAUGH_ONSETS){if(elapsed>=onset&&elapsed<onset+LAUGH_DURATION)frame=Math.min(7,Math.floor((elapsed-onset)/LAUGH_DURATION*8));}
      this.wizard.style.backgroundPosition=`${(frame%4)/3*100}% ${Math.floor(frame/4)*100}%`;
      if(elapsed>2850&&Math.random()<.25)this.smoke.burst(.5,.58,3);
      this.frame=requestAnimationFrame(tick);
    };this.frame=requestAnimationFrame(tick);
  }
}
