export const DEFAULT_CHALLENGE_MINUTES = 2;
export const MIN_CHALLENGE_MINUTES = 1;
export const MAX_CHALLENGE_MINUTES = 60;

export function challengeMinutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function clampChallengeMinutes(minutes: number): number {
  return Math.min(
    MAX_CHALLENGE_MINUTES,
    Math.max(MIN_CHALLENGE_MINUTES, Math.round(minutes)),
  );
}
