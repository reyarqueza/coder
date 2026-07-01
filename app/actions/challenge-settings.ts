"use server";

import { auth } from "@/auth";
import { DEFAULT_CHALLENGE_MINUTES } from "@/lib/challenge/constants";
import {
  getChallengeMinutesForUser,
  upsertChallengeMinutesForUser,
} from "@/lib/challenge/settings";

export async function getChallengeMinutes(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    return DEFAULT_CHALLENGE_MINUTES;
  }

  return getChallengeMinutesForUser(session.user.id);
}

export async function updateChallengeMinutes(
  minutes: number,
): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    return DEFAULT_CHALLENGE_MINUTES;
  }

  return upsertChallengeMinutesForUser(session.user.id, minutes);
}
