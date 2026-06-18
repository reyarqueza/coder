import Link from "next/link";

export function LoggedOutHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
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
      </div>
    </header>
  );
}
