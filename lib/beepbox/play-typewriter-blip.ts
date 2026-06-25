import { Synth } from "beepbox";
import { TYPEWRITER_BLIP_SONG } from "@/lib/beepbox/typewriter-blip-song";

const TYPEWRITER_PITCH = 24;
const BLIP_DURATION_PARTS = 2;

let synth: Synth | null = null;
let typewriterEnabled = true;

function getTypewriterSynth(): Synth {
  if (!synth) {
    synth = new Synth(TYPEWRITER_BLIP_SONG);
    synth.liveInputChannel = 0;
    synth.liveInputInstruments = [0];
    synth.preferLowerLatency = true;
  }
  return synth;
}

/** Call synchronously from the Start button click to unlock Web Audio. */
export function primeTypewriterAudio() {
  getTypewriterSynth().maintainLiveInput();
}

export function setTypewriterAudioEnabled(enabled: boolean) {
  typewriterEnabled = enabled;

  if (!enabled && synth) {
    synth.liveInputStarted = false;
    synth.maintainLiveInput();
  }
}

export function playTypewriterBlip() {
  if (!typewriterEnabled) return;

  const instance = getTypewriterSynth();
  instance.liveInputPitches = [TYPEWRITER_PITCH];
  instance.liveInputStarted = true;
  instance.liveInputDuration = BLIP_DURATION_PARTS;
  instance.maintainLiveInput();
}

export function shouldPlayTypewriterBlip(character: string) {
  return character.trim().length > 0;
}
