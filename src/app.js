import { initialState, reduce, presentation } from './state.js';
import { keyboardAction } from './input.js';
import { mountLayout } from './layout.js';
import { Display } from './display.js';
import { Smoke } from './smoke.js';
import { AudioController } from './audio.js';
import { AnimationController } from './animation.js';
let state=initialState();
const display=new Display(document.querySelector('#display'));
const layout=mountLayout(activate);
const audio=new AudioController();
const smoke=new Smoke(document.querySelector('#rear-smoke'),document.querySelector('#front-smoke'));
const announcement=document.querySelector('#announcement');
const animation=new AnimationController({display,smoke,audio,wizard:document.querySelector('#wizard'),onErrorEnd:()=>{state=reduce(state,'C');announcement.textContent='';updateDiagnostics();}});
const candle=document.querySelector('#candle');
function updateCandle(){candle.classList.toggle('muted',!audio.enabled);candle.setAttribute('aria-pressed',String(audio.enabled));candle.setAttribute('aria-label',audio.enabled?'Ton ausschalten':'Ton einschalten');}
candle.addEventListener('click',()=>{audio.unlock();audio.toggle();updateCandle();candle.classList.remove('extinguishing');if(!audio.enabled){void candle.offsetWidth;candle.classList.add('extinguishing');}});
updateCandle();
function updateDiagnostics(){document.querySelector('#artifact').dataset.state=state.mode;document.querySelector('#orb').dataset.hidden=String(presentation(state).hidden);}
function activate(action) {
  if(action!=='C')audio.unlock();
  const button=layout.buttons.get(action);button?.classList.remove('active');if(button){void button.offsetWidth;button.classList.add('active');}
  const next=reduce(state,action);if(next===state)return;state=next;
  const view=presentation(state);
  if(action==='C'){animation.clear();for(const b of layout.buttons.values())b.classList.remove('active');}
  else if(state.effect.type==='result')animation.result(view.visible);
  else if(state.effect.type==='error')animation.error();
  else animation.input(view.visible,view.hidden,state.effect);
  announcement.textContent=state.mode==='error'?'Dieser Zauber ist nicht möglich.':view.full;updateDiagnostics();
}
addEventListener('keydown',event=>{if(event.target===candle&&['Enter',' '].includes(event.key))return;const action=keyboardAction(event);if(action){event.preventDefault();activate(action);}});
addEventListener('pagehide',()=>animation.clear());
updateDiagnostics();
