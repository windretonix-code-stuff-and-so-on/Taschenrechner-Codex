import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../src/tokenizer.js';
import { calculate } from '../src/evaluator.js';
import { formatResult, normalize, displayWindow } from '../src/formatter.js';
import { validPrefix, keyboardAction } from '../src/input.js';
import { initialState, reduce, presentation } from '../src/state.js';
const type = (keys, state = initialState()) => keys.reduce(reduce, state);
for (const [source, expected] of [['2+3*4',14],['(2+3)*4',20],['(2+(3*4))/2',7],['25+(-12)',13],['-5*-2',10],['12/3/2',2],['0,1+0,2',0.30000000000000004],['1e-9*2',2e-9]]) {
  test('arithmetic: ' + source, () => assert.equal(calculate(source), expected));
}
for (const source of ['2(3+4)','(2)3','2..3','1;alert(1)','Infinity','2+','()','2 3']) {
  test('rejects: ' + source, () => assert.throws(() => calculate(source)));
}
for (const source of ['5/0','5/(3-3)','0/0','1e308*10']) test('math error: ' + source, () => assert.throws(() => calculate(source)));
test('tokenizer canonicalizes UI symbols', () => assert.deepEqual(tokenize('2,5×3−1'),tokenize('2.5*3-1')));
test('float artifacts and negative zero normalized', () => { assert.equal(normalize(0.1+0.2),'0.3'); assert.equal(formatResult(-0),'0'); });
test('results respect nine characters across numeric range', () => { for (const n of [1e308,-1e308,1e-308,-1e-308,12345678901,0.123456789]) assert.ok(formatResult(n).length <= 9); });
test('valid incomplete expressions remain enterable', () => { for (const s of ['(25+','-','2*(-','0.']) assert.ok(validPrefix(s)); });
test('invalid sequences prevented', () => { for (const s of ['2(','2++','2/*','1..','()',')','(2)3']) assert.equal(validPrefix(s),false,s); });
test('clean negate toggles current operand', () => {
  let state = type([... '25+12','+/-']); assert.equal(state.expression,'25+(-12)');
  state = reduce(state,'+/-'); assert.equal(state.expression,'25+12');
});
test('no implicit multiplication through input', () => assert.equal(type(['2','(']).expression,'2'));
test('operator continues unrounded result; digit restarts', () => {
  const state = type(['1','÷','3','=']);
  assert.equal(type(['×','3','='],state).result,1);
  assert.equal(reduce(state,'7').expression,'7');
});
test('equals idempotent by object identity', () => { const s=type(['2','+','2','=']); assert.equal(reduce(s,'='),s); });
test('nine-character window reverses exactly', () => {
  let state = type([...'123456789012']); assert.deepEqual(presentation(state),{full:'123456789012',visible:'456789012',hidden:3});
  state=reduce(state,'backspace'); assert.equal(presentation(state).visible,'345678901'); assert.equal(state.effect.delta,-1);
});
test('clear resets result/error/input and increments generation', () => {
  for (const s of [type(['2','=']),type(['5','÷','0','=']),type(['1'])]) {
    const reset=reduce(s,'C'); assert.equal(reset.mode,'idle'); assert.equal(reset.expression,''); assert.equal(reset.revision,s.revision+1);
  }
});
test('incomplete equals is ignored', () => { const s=type(['(','2','+']); assert.equal(reduce(s,'='),s); });
test('keyboard aliases and modifiers', () => {
  for (const [key,expected] of [['Enter','='],['Escape','C'],['Backspace','backspace'],['.',','],['*','×'],['/','÷']]) assert.equal(keyboardAction({key}),expected);
  assert.equal(keyboardAction({key:'3',ctrlKey:true}),null);
});
test('rapid entry and reversal never desynchronize hidden count', () => {
  let s=initialState(); for(let i=0;i<90;i++) { s=reduce(s,String(i%10)); assert.equal(presentation(s).hidden,Math.max(0,s.expression.length-9)); }
  for(let i=0;i<90;i++) { s=reduce(s,'backspace'); assert.equal(presentation(s).hidden,Math.max(0,s.expression.length-9)); }
  assert.equal(presentation(s).visible,'');
});
test('depth and input limits prevent runaway work', () => { assert.equal(validPrefix('('.repeat(129)),false); assert.equal(validPrefix('1'.repeat(513)),false); });
test('continuation hides floating artifacts without changing internal precision',()=>{
  const result=type([...'0,1+0,2','=']);const next=reduce(result,'+');
  assert.equal(presentation(next).visible,'0,3+');assert.equal(next.expression,'0.30000000000000004+');
  const shortened=reduce(reduce(next,'backspace'),'backspace');assert.equal(shortened.expression,'0.');
});
