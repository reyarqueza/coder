import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { WelcomeCard } from "@/components/welcome-card";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <WelcomeCard
      name={session.user.name}
      email={session.user.email}
      image={session.user.image}
    />
  );
}

export default function DashboardPage() {
  return (
    <>
      <AppHeader name="Dashboard" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}
