import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import { AppHeader } from "@/components/app-header";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardLayoutFallback() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col p-6">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className={pressStart2P.variable}>
      <DashboardLayoutClient user={session.user}>
        {children}
      </DashboardLayoutClient>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutFallback />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
