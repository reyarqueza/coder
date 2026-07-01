import { getChallengeMinutes } from "@/app/actions/challenge-settings";
import { DashboardPageClient } from "@/components/dashboard-page-client";

export default async function DashboardPage() {
  const initialChallengeMinutes = await getChallengeMinutes();

  return (
    <DashboardPageClient initialChallengeMinutes={initialChallengeMinutes} />
  );
}
