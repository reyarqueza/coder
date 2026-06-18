import { Suspense } from "react";
import { CookieConsent } from "@/components/cookie-consent";
import { LoggedOutFooter } from "@/components/logged-out-footer";
import { LoggedOutHeader } from "@/components/logged-out-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoggedOutHeader />
      {children}
      <Suspense
        fallback={
          <footer className="border-t">
            <div className="mx-auto h-20 max-w-6xl" />
          </footer>
        }
      >
        <LoggedOutFooter />
      </Suspense>
      <CookieConsent />
    </>
  );
}
