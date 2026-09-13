import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSound,saveSound} from '../src/storage.js';
test('sound preference persists and defaults on',()=>{const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};assert.equal(loadSound(storage),true);saveSound(false,storage);assert.equal(loadSound(storage),false);saveSound(true,storage);assert.equal(loadSound(storage),true);});
test('blocked storage remains recoverable',()=>{const storage={getItem(){throw Error();},setItem(){throw Error();}};assert.equal(loadSound(storage),true);assert.doesNotThrow(()=>saveSound(false,storage));});
