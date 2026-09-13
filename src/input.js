export function keyboardAction(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return null;
  const map = { Enter: '=', '=': '=', Backspace: 'backspace', Escape: 'C', '.': ',', '*': '×', '/': '÷', '-': '−' };
  return map[event.key] || (/^[0-9+(),]$/.test(event.key) ? event.key : null);
}
export function validPrefix(source) {
  if (source.length > 512) return false;
  let depth = 0, expectsValue = true, number = '', unary = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (/\d/.test(c) || c === '.') {
      if (!expectsValue && !number) return false;
      if (c === '.' && number.includes('.')) return false;
      number += c; expectsValue = false; unary = false;
    } else if (c === 'e' && number) {
      const m = source.slice(i).match(/^e[+-]?\d+/);
      if (!m) return false;
      number += m[0]; i += m[0].length - 1;
    } else if (c === '(') {
      if (!expectsValue || ++depth > 128) return false;
      number = ''; unary = false;
    } else if (c === ')') {
      if (expectsValue || depth-- <= 0) return false;
      number = ''; unary = false;
    } else if ('+-*/'.includes(c)) {
      if (expectsValue) {
        if (c !== '-' || unary) return false;
        unary = true;
      } else { expectsValue = true; unary = false; }
      number = '';
    } else return false;
  }
  return true;
}
export const isComplete = source => source.length > 0 && validPrefix(source) && !/[+*/.(-]$/.test(source) && [...source].filter(c => c === '(').length === [...source].filter(c => c === ')').length;
export function negateLastNumber(source) {
  const wrapped = source.match(/\(-((?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\)$/);
  if (wrapped) return source.slice(0, wrapped.index) + wrapped[1];
  const match = source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/);
  if (!match) return source;
  const prefix = source.slice(0, match.index);
  if (prefix.endsWith('-') && (prefix.length === 1 || /[+*/(-]$/.test(prefix.slice(0, -1)))) return prefix.slice(0, -1) + match[0];
  return prefix + '(-' + match[0] + ')';
}
