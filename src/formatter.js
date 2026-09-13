export function normalize(value) {
  if (!Number.isFinite(value)) throw new RangeError('Non-finite result');
  return Object.is(value, -0) ? '0' : Number(value.toPrecision(15)).toString();
}
export function formatResult(value, limit = 9) {
  const full = normalize(value);
  if (full.length <= limit) return full.replace('.', ',').replace('-', '−');
  for (let precision = 8; precision >= 1; precision--) {
    const candidate = Number(value.toPrecision(precision)).toString().replace('e+', 'e');
    if (candidate.length <= limit) return candidate.replace('.', ',').replace('-', '−');
  }
  return value.toExponential(0).replace('e+', 'e').replace('-', '−');
}
export const expressionText = source => source.replaceAll('.', ',').replaceAll('*', '×').replaceAll('/', '÷').replaceAll('-', '−');
export function displayWindow(source) {
  const text = expressionText(source);
  return { full: text, visible: text.slice(-9), hidden: Math.max(0, text.length - 9) };
}
