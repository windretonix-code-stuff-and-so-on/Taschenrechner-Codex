import { CalculationError } from './tokenizer.js';
export function parse(tokens) {
  let cursor = 0;
  const peek = () => tokens[cursor]?.type;
  function primary(depth) {
    if (depth > 128) throw new CalculationError('limit');
    if (peek() === '+' || peek() === '-') {
      const op = tokens[cursor++].type;
      return { kind: 'unary', op, value: primary(depth + 1) };
    }
    if (peek() === 'number') return { kind: 'number', value: tokens[cursor++].value };
    if (peek() === '(') {
      cursor++; const value = expression(depth + 1);
      if (peek() !== ')') throw new CalculationError('syntax');
      cursor++; return value;
    }
    throw new CalculationError('syntax');
  }
  function product(depth) {
    let left = primary(depth);
    while (peek() === '*' || peek() === '/') {
      const op = tokens[cursor++].type;
      left = { kind: 'binary', op, left, right: primary(depth) };
    }
    return left;
  }
  function expression(depth) {
    let left = product(depth);
    while (peek() === '+' || peek() === '-') {
      const op = tokens[cursor++].type;
      left = { kind: 'binary', op, left, right: product(depth) };
    }
    return left;
  }
  const tree = expression(0);
  if (cursor !== tokens.length) throw new CalculationError('syntax');
  return tree;
}
