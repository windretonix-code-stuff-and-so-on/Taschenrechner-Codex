import test from 'node:test';
import assert from 'node:assert/strict';
import {smokeFill} from '../src/smoke.js';
test('every displaced character increases persistent smoke density',()=>{
  for(let hidden=1;hidden<=100;hidden++)assert.ok(smokeFill(hidden).density>smokeFill(hidden-1).density);
  assert.ok(smokeFill(1).rearCount>smokeFill(0).rearCount);
});
test('restoring characters restores the same smoke fill and reset clears it',()=>{
  const original=smokeFill(3);smokeFill(12);assert.deepEqual(smokeFill(3),original);
  assert.equal(smokeFill(0).density,0);
  assert.ok(smokeFill(512).rearCount<=48);assert.ok(smokeFill(512).frontCount<=13);
});
