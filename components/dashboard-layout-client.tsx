"use client";

import { AppHeader } from "@/components/app-header";
import { WebContainerProvider } from "@/components/workspace/webcontainer-provider";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: DashboardUser;
}) {
  return (
    <WebContainerProvider>
      <div className="flex min-h-svh flex-col">
        <AppHeader name={user.name} email={user.email} image={user.image} />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </WebContainerProvider>
  );
}
