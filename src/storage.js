const KEY='magic-orb.sound';
export function loadSound(storage) {try{return (storage??globalThis.localStorage).getItem(KEY)!=='off';}catch{return true;}}
export function saveSound(enabled,storage) {try{(storage??globalThis.localStorage).setItem(KEY,enabled?'on':'off');}catch{/* Private/storage-blocked sessions retain their in-memory preference. */}}
