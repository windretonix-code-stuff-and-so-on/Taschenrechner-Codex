import { calculate } from './evaluator.js';
import { normalize, formatResult, displayWindow } from './formatter.js';
import { validPrefix, isComplete, negateLastNumber } from './input.js';
export const initialState = () => ({ expression: '', result: null, displayPrefix: null, mode: 'idle', revision: 0, effect: null });
export function reduce(state, action) {
  if (action === 'C') return { ...initialState(), revision: state.revision + 1, effect: { type: 'clear' } };
  if (state.mode === 'error') return state;
  if (action === '=') {
    if (state.mode === 'result' || !isComplete(state.expression)) return state;
    try {
      return { ...state, result: calculate(state.expression), mode: 'result', revision: state.revision + 1, effect: { type: 'result' } };
    } catch {
      return { ...state, expression: '', result: null, mode: 'error', revision: state.revision + 1, effect: { type: 'error' } };
    }
  }
  let expression = state.expression, displayPrefix = state.displayPrefix;
  if (state.mode === 'result') {
    displayPrefix = null;
    if (/^[0-9,(]$/.test(action)) expression = '';
    else if (action === 'backspace') expression = normalize(state.result);
    else {
      expression = String(state.result);
      displayPrefix = { raw: expression, text: normalize(state.result) };
    }
  }
  if (action === 'backspace' && displayPrefix && expression === displayPrefix.raw) { expression = displayPrefix.text; displayPrefix = null; }
  if (action === 'backspace') expression = expression.slice(0, -1);
  else if (action === '+/-') expression = negateLastNumber(expression);
  else {
    const char = ({ '×': '*', '÷': '/', '−': '-', ',': '.' })[action] || action;
    if (!/^[0-9+*/().-]$/.test(char)) return state;
    expression += char === '.' && (!expression || /[+*/(-]$/.test(expression)) ? '0.' : char;
  }
  if (!validPrefix(expression) || expression === state.expression && state.mode !== 'result') return state;
  if(displayPrefix && !expression.startsWith(displayPrefix.raw))displayPrefix=null;
  const previous = presentation(state);
  const next = presentation({expression,displayPrefix,mode:'input'});
  return { expression, result: null, displayPrefix, mode: expression ? 'input' : 'idle', revision: state.revision + 1, effect: { type: 'input', delta: next.hidden - previous.hidden, reverse: action === 'backspace' } };
}
export function presentation(state) {
  if (state.mode === 'result') return { full: normalize(state.result), visible: formatResult(state.result), hidden: 0 };
  const prefix=state.displayPrefix;
  return displayWindow(prefix&&state.expression.startsWith(prefix.raw)?prefix.text+state.expression.slice(prefix.raw.length):state.expression);
}

