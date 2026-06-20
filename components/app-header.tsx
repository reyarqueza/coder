"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageContainer } from "@/components/page-container";
import { logout } from "@/app/actions/auth";

type AppHeaderProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function getInitials(name?: string | null, email?: string | null) {
  return (name ?? email ?? "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppHeader({ name, email, image }: AppHeaderProps) {
  const initials = getInitials(name, email);

  return (
    <header className="w-full shrink-0 border-b">
      <PageContainer className="flex h-14 items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Coder Bahamuto</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {name ?? "Signed-in user"}
            </span>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
          <ThemeToggle />
        </div>
      </PageContainer>
    </header>
  );
}
