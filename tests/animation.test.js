import test from 'node:test';
import assert from 'node:assert/strict';
import { AnimationController } from '../src/animation.js';
import { AudioController } from '../src/audio.js';
function fixture(){
  let callback=null,shown='2+2',laughs=0,stops=0,ended=0;
  globalThis.requestAnimationFrame=fn=>{callback=fn;return 1;};globalThis.cancelAnimationFrame=()=>{callback=null;};
  const display={text:shown,points:()=>[{x:.5,y:.5}],cancel(){},dissolve(){},show(text){shown=text;}};
  const smoke={mode:'idle',setHidden(){},burst(){},reset(){}};
  const audio={stop(){stops++;},laugh(){laughs++;}};
  const wizard={style:{}};
  const controller=new AnimationController({display,smoke,audio,wizard,onErrorEnd(){ended++;}});
  return{controller,wizard,step(time){const fn=callback;callback=null;fn?.(time);},get shown(){return shown;},get laughs(){return laughs;},get stops(){return stops;},get ended(){return ended;}};
}
test('wizard has exactly three laugh impulses on its visual timeline',()=>{
  const f=fixture();f.controller.error();const start=performance.now();
  for(const time of [0,850,950,1290,1530,1800,2210,2410,2900,3501])f.step(start+time);
  assert.equal(f.laughs,3);assert.equal(f.ended,1);assert.equal(f.wizard.style.opacity,'0');
});
test('clear invalidates pending result and wizard frames',()=>{
  for(const mode of ['result','error']){const f=fixture();f.controller[mode]('4');f.controller.clear();f.step(performance.now()+5000);assert.equal(f.shown,'');assert.equal(f.laughs,0);assert.equal(f.wizard.style.opacity,'0');assert.ok(f.stops>=2);}
});
test('result is present at 1.1 seconds and final settling ends at 1.4 seconds',()=>{
  const f=fixture();f.controller.result('4');const start=performance.now();f.step(start+1110);assert.equal(f.shown,'4');assert.equal(f.controller.mode,'settling');f.step(start+1410);assert.equal(f.controller.mode,'idle');
});
test('audio stop disconnects every registered node and stops every source',()=>{
  const audio=new AudioController();let stops=0,disconnects=0;
  audio.nodes.add({stop(){stops++;},disconnect(){disconnects++;}});audio.nodes.add({disconnect(){disconnects++;}});
  audio.stop();assert.equal(stops,1);assert.equal(disconnects,2);assert.equal(audio.nodes.size,0);
});
