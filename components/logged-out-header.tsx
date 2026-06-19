import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoggedOutHeader() {
  return (
    <header className="w-full border-b">
      <PageContainer className="flex h-14 items-center justify-between">
        <Link
          href="/login"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          Coder Bahamuto
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <ThemeToggle />
        </div>
      </PageContainer>
    </header>
  );
}
