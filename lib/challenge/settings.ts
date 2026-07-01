import {
  clampChallengeMinutes,
  DEFAULT_CHALLENGE_MINUTES,
} from "@/lib/challenge/constants";
import { getPool } from "@/lib/db/pool";

export async function getChallengeMinutesForUser(
  userId: string,
): Promise<number> {
  const pool = getPool();
  const result = await pool.query<{ challengeMinutes: number }>(
    `SELECT "challengeMinutes" FROM user_settings WHERE "userId" = $1`,
    [userId],
  );

  if (result.rows.length === 0) {
    return DEFAULT_CHALLENGE_MINUTES;
  }

  return clampChallengeMinutes(result.rows[0].challengeMinutes);
}

export async function upsertChallengeMinutesForUser(
  userId: string,
  minutes: number,
): Promise<number> {
  const clamped = clampChallengeMinutes(minutes);
  const pool = getPool();

  await pool.query(
    `INSERT INTO user_settings ("userId", "challengeMinutes")
     VALUES ($1, $2)
     ON CONFLICT ("userId")
     DO UPDATE SET "challengeMinutes" = EXCLUDED."challengeMinutes"`,
    [userId, clamped],
  );

  return clamped;
}
