const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class Smoke {
  constructor(rear,front){
    this.canvases=[rear,front];this.contexts=this.canvases.map(c=>c.getContext('2d'));this.particles=[];this.hidden=0;this.mode='idle';this.energy=0;this.last=0;this.frame=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.sprites=['115,138,240','114,83,210','46,42,77'].map(rgb=>{
      const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(48,48,0,48,48,48);g.addColorStop(0,`rgba(${rgb},.75)`);g.addColorStop(.4,`rgba(${rgb},.35)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,96,96);return c;
    });
    this.resize=()=>{const width=rear.getBoundingClientRect().width;const size=Math.min(900,Math.max(256,Math.round(width*Math.min(devicePixelRatio,1.6))));this.size=size;for(const c of this.canvases)c.width=c.height=size;};
    addEventListener('resize',this.resize);this.resize();this.tick=this.tick.bind(this);this.frame=requestAnimationFrame(this.tick);
  }
  setHidden(count){this.hidden=Math.max(0,count);}
  burst(x=.5,y=.5,count=22,reverse=false){
    for(let i=0;i<count&&this.particles.length<180;i++){
      const angle=Math.random()*Math.PI*2,speed=.015+Math.random()*.09;
      this.particles.push({x:reverse?.5+(Math.random()-.5)*.3:x,y:reverse?.5+(Math.random()-.5)*.3:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,duration:.45+Math.random()*.55,target:reverse?{x,y}:null,front:i%4===0});
    }
  }
  reset(){this.hidden=0;this.energy=0;this.mode='idle';this.particles=[];for(const ctx of this.contexts)ctx.clearRect(0,0,this.size,this.size);}
  tick(now){
    this.frame=requestAnimationFrame(this.tick);
    if(document.hidden){this.last=now;return;}
    if(now-this.last<33)return;
    const dt=Math.min((now-this.last)/1000,.06);this.last=now;
    const size=this.size,t=now/1000;
    for(const [layer,ctx] of this.contexts.entries()){
      ctx.clearRect(0,0,size,size);ctx.save();ctx.scale(size,size);ctx.beginPath();ctx.arc(.5,.5,.485,0,Math.PI*2);ctx.clip();
      const count=layer?5:12;
      for(let i=0;i<count;i++){
        const angle=i*2.399+t*(this.reduced?.008:this.mode==='error'?.23:.026)*(i%2?1:-1);
        const radius=this.mode==='result'?.07+.07*Math.sin(t*3+i):.2+.06*Math.sin(i+t*.12);
        const x=.5+Math.cos(angle)*radius,y=(layer&&this.mode==='error'?.76:.55)+Math.sin(angle)*radius*.82;
        const extent=.28+.08*Math.sin(i*1.7+t*.2);
        ctx.globalAlpha=clamp((layer?.18:.38)*(0.12+Math.log1p(this.hidden)*.12+this.energy*1.8),0,1);
        if(this.mode==='error')ctx.globalAlpha*=1.35;
        ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(1,.58+.1*Math.sin(t+i));
        ctx.drawImage(this.sprites[this.mode==='error'?2:i%2],-extent/2,-extent/2,extent,extent);ctx.restore();
      }
      ctx.globalCompositeOperation='lighter';
      for(const p of this.particles){
        if(p.front!==Boolean(layer))continue;
        const progress=p.life/p.duration,alpha=Math.sin(Math.PI*clamp(progress,0,1));
        ctx.globalAlpha=alpha*.75;ctx.fillStyle='#cde9ff';ctx.beginPath();ctx.arc(p.x,p.y,.0013+(1-progress)*.0016,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
    for(const p of this.particles){p.life+=dt;if(p.target){p.x+=(p.target.x-p.x)*dt*7;p.y+=(p.target.y-p.y)*dt*7;}else{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=(.5-p.x)*dt*.12;p.vy+=(.5-p.y)*dt*.12;}}
    this.particles=this.particles.filter(p=>p.life<p.duration);this.energy=Math.max(0,this.energy-dt*.32);
  }
}
