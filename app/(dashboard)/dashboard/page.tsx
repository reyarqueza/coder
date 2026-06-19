import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { WelcomeCard } from "@/components/welcome-card";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { name, email, image } = session.user;

  return (
    <>
      <AppHeader name={name} email={email} image={image} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
        <WelcomeCard name={name} email={email} image={image} />
      </main>
    </>
  );
}

function DashboardFallback() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
