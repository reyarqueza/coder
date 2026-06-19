import { Suspense } from "react";
import { CookieConsent } from "@/components/cookie-consent";
import { LoggedOutFooter } from "@/components/logged-out-footer";
import { LoggedOutHeader } from "@/components/logged-out-header";
import { PageContainer } from "@/components/page-container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex w-full flex-1 flex-col">
        <LoggedOutHeader />
        {children}
        <Suspense
          fallback={
            <footer className="w-full border-t">
              <PageContainer className="h-20">{null}</PageContainer>
            </footer>
          }
        >
          <LoggedOutFooter />
        </Suspense>
      </div>
      <CookieConsent />
    </>
  );
}
