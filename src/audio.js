import { loadSound,saveSound } from './storage.js';
// Intentionally provisional synthesized voice, explicitly authorized by the user.
// The three envelopes share their onset clock with the wizard sprite animation.
export const LAUGH_ONSETS=[850,1530,2210];
export const LAUGH_DURATION=440;
export class AudioController {
  constructor(){this.enabled=loadSound();this.context=null;this.nodes=new Set();this.generation=0;}
  unlock(){
    try{this.context??=new (globalThis.AudioContext||globalThis.webkitAudioContext)();return this.context.resume().catch(()=>{});}catch{return Promise.resolve();}
  }
  toggle(){this.enabled=!this.enabled;saveSound(this.enabled);if(!this.enabled)this.stop();return this.enabled;}
  stop(){this.generation++;for(const node of this.nodes){try{node.stop();}catch{}try{node.disconnect();}catch{}}this.nodes.clear();}
  laugh(){
    if(!this.enabled||!this.context||this.context.state!=='running')return;
    const ctx=this.context,t=ctx.currentTime;
    const envelope=ctx.createGain();envelope.gain.setValueAtTime(0,t);envelope.gain.linearRampToValueAtTime(.035,t+.055);envelope.gain.exponentialRampToValueAtTime(.0001,t+.39);envelope.connect(ctx.destination);this.nodes.add(envelope);
    const formant=ctx.createBiquadFilter();formant.type='bandpass';formant.frequency.value=650;formant.Q.value=.8;formant.connect(envelope);this.nodes.add(formant);
    const delay=ctx.createDelay(.2),wet=ctx.createGain();delay.delayTime.value=.075;wet.gain.value=.17;formant.connect(delay);delay.connect(wet);wet.connect(envelope);this.nodes.add(delay);this.nodes.add(wet);
    for(const [frequency,gain] of [[91,1],[182,.37],[273,.13]]){
      const osc=ctx.createOscillator(),level=ctx.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(frequency*1.12,t);osc.frequency.exponentialRampToValueAtTime(frequency*.84,t+.34);level.gain.value=gain;osc.connect(level);level.connect(formant);this.nodes.add(osc);this.nodes.add(level);osc.start(t);osc.stop(t+.42);
      osc.onended=()=>{osc.disconnect();level.disconnect();this.nodes.delete(osc);this.nodes.delete(level);};
    }
    // No independent delayed callbacks: stopping all registered nodes is immediate.
  }
}
