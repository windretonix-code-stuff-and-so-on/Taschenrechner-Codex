import { tokenize, CalculationError } from './tokenizer.js';
import { parse } from './parser.js';
export function evaluateTree(node) {
  let value;
  if (node.kind === 'number') value = node.value;
  else if (node.kind === 'unary') value = (node.op === '-' ? -1 : 1) * evaluateTree(node.value);
  else {
    const a = evaluateTree(node.left), b = evaluateTree(node.right);
    if (node.op === '/' && b === 0) throw new CalculationError('division-by-zero');
    value = node.op === '+' ? a + b : node.op === '-' ? a - b : node.op === '*' ? a * b : a / b;
  }
  if (!Number.isFinite(value)) throw new CalculationError('range');
  return value;
}
export const calculate = source => evaluateTree(parse(tokenize(source)));
