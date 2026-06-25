// Charge fanfare (G4 G4 G4 C5 E5 G5) with the sci-fi FM preset (BeepBox 4.2, preset 906).
// Composed in BeepBox at 150 BPM, one bar.

export const SCI_FI_OUTCOME_SONG =
  "9n31s0k0l00e03t2ma3g00j07r1i0o432T1v1ueaf12taq0y10r53d18A8F8B8Q126bPda58E4b862863g78T0v0u00f0qw02d04w2h0E0T0v0u00f0qw02d04w2h0E0T2v0u02f0qw02d04w1E0b4h4p1kk3zcEEgkDMq3b0w00000";

export const CHARGE_FANFARE_TEMPO = 150;

/** Note timing copied from the BeepBox pattern (parts at CHARGE_FANFARE_TEMPO). */
export const CHARGE_FANFARE_NOTES = [
  { pitch: 31, startPart: 0, durationParts: 8 },
  { pitch: 31, startPart: 8, durationParts: 8 },
  { pitch: 31, startPart: 16, durationParts: 8 },
  { pitch: 36, startPart: 24, durationParts: 18 },
  { pitch: 40, startPart: 42, durationParts: 18 },
  { pitch: 43, startPart: 60, durationParts: 36 },
] as const;
