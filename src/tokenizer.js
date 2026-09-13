export class CalculationError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function tokenize(source) {
  const normalized = source.replaceAll(',', '.').replaceAll('−', '-').replaceAll('×', '*').replaceAll('÷', '/');
  const tokens = [];
  for (let i = 0; i < normalized.length;) {
    const char = normalized[i];
    if ('0123456789.'.includes(char)) {
      const match = normalized.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/);
      if (!match) throw new CalculationError('syntax');
      const value = Number(match[0]);
      if (!Number.isFinite(value)) throw new CalculationError('range');
      tokens.push({ type: 'number', value }); i += match[0].length;
    } else if ('+-*/()'.includes(char)) { tokens.push({ type: char }); i++; }
    else throw new CalculationError('syntax');
    if (tokens.length > 1024) throw new CalculationError('limit');
  }
  return tokens;
}
