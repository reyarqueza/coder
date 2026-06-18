import Link from "next/link";
import { PageContainer } from "@/components/page-container";

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
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Login
        </Link>
      </PageContainer>
    </header>
  );
}
