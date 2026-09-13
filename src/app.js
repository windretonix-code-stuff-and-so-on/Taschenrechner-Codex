import { initialState, reduce, presentation } from './state.js';
import { keyboardAction } from './input.js';
import { mountLayout } from './layout.js';
import { Display } from './display.js';
let state=initialState();
const display=new Display(document.querySelector('#display'));
const layout=mountLayout(activate);
function activate(action) {
  const button=layout.buttons.get(action);button?.classList.remove('active');if(button){void button.offsetWidth;button.classList.add('active');}
  const next=reduce(state,action);if(next===state)return;state=next;
  display.cancel();display.show(presentation(state).visible,{reverse:state.effect?.reverse,animate:action!=='C'});
  document.querySelector('#announcement').textContent=state.mode==='error'?'Dieser Zauber ist nicht möglich.':presentation(state).full;
}
addEventListener('keydown',event=>{const action=keyboardAction(event);if(action){event.preventDefault();activate(action);}});
