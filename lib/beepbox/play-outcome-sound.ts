import { Synth } from "beepbox";
import {
  CHARGE_FANFARE_NOTES,
  CHARGE_FANFARE_TEMPO,
  SCI_FI_OUTCOME_SONG,
} from "@/lib/beepbox/sci-fi-outcome-song";
import { TYPEWRITER_BLIP_SONG } from "@/lib/beepbox/typewriter-blip-song";

const MS_PER_PART = 60000 / (CHARGE_FANFARE_TEMPO * 24);
const FAILURE_MS_PER_PART = 30;

export const FAILURE_REVEAL_PAUSE_MS = 1000;

export function getFailureSoundDurationMs(): number {
  return Math.max(
    ...FAIL_WAH_NOTES.map(
      (note) => note.startMs + note.durationParts * FAILURE_MS_PER_PART,
    ),
  );
}

export function delayAfterFailureSound(
  pauseMs = FAILURE_REVEAL_PAUSE_MS,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(
      resolve,
      getFailureSoundDurationMs() + pauseMs,
    );
  });
}

// Classic sad-trombone "wah wah waaaaah" (descending, last note held).
const FAIL_WAH_NOTES = [
  { pitch: 33, startMs: 0, durationParts: 4 },
  { pitch: 30, startMs: 120, durationParts: 4 },
  { pitch: 27, startMs: 240, durationParts: 5 },
  { pitch: 23, startMs: 380, durationParts: 6 },
  { pitch: 19, startMs: 520, durationParts: 18 },
] as const;

let failureSynth: Synth | null = null;
let successSynth: Synth | null = null;

function getFailureSynth(): Synth {
  if (!failureSynth) {
    failureSynth = new Synth(TYPEWRITER_BLIP_SONG);
    failureSynth.liveInputChannel = 0;
    failureSynth.liveInputInstruments = [0];
    failureSynth.preferLowerLatency = true;
  }
  return failureSynth;
}

function getSuccessSynth(): Synth {
  if (!successSynth) {
    successSynth = new Synth(SCI_FI_OUTCOME_SONG);
    successSynth.liveInputChannel = 0;
    successSynth.liveInputInstruments = [0];
    successSynth.preferLowerLatency = true;
  }
  return successSynth;
}

function playLiveNote(
  synth: Synth,
  pitch: number,
  durationParts: number,
) {
  synth.liveInputPitches = [pitch];
  synth.liveInputStarted = true;
  synth.liveInputDuration = durationParts;
  synth.maintainLiveInput();
}

/** Unlock Web Audio for outcome sounds during a user gesture. */
export function primeSuccessAudio() {
  getSuccessSynth().maintainLiveInput();
}

export function primeFailureAudio() {
  getFailureSynth().maintainLiveInput();
}

export function primeOutcomeAudio() {
  primeSuccessAudio();
  primeFailureAudio();
}

/** Sad trombone "wah wah waaaaah" failure cue. */
export function playFailureSound() {
  const synth = getFailureSynth();
  synth.maintainLiveInput();

  for (const note of FAIL_WAH_NOTES) {
    window.setTimeout(
      () => playLiveNote(synth, note.pitch, note.durationParts),
      note.startMs,
    );
  }
}

/** Stadium Charge fanfare on the sci-fi preset. */
export function playSuccessSound() {
  const synth = getSuccessSynth();
  synth.maintainLiveInput();

  for (const note of CHARGE_FANFARE_NOTES) {
    window.setTimeout(
      () => playLiveNote(synth, note.pitch, note.durationParts),
      note.startPart * MS_PER_PART,
    );
  }
}
