"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "coder-bahamuto-cookie-consent";

export type CookieConsent = "accepted" | "essential-only";

function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "essential-only") return value;
  return null;
}

function storeConsent(consent: CookieConsent) {
  localStorage.setItem(CONSENT_KEY, consent);
}

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setMounted(true);
  }, []);

  if (!mounted || consent !== null) return null;

  function handleAccept() {
    storeConsent("accepted");
    setConsent("accepted");
  }

  function handleEssentialOnly() {
    storeConsent("essential-only");
    setConsent("essential-only");
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 id="cookie-consent-title" className="text-sm font-semibold">
            We use cookies
          </h2>
          <p
            id="cookie-consent-description"
            className="max-w-2xl text-sm text-muted-foreground"
          >
            Essential cookies keep you signed in and the site working. Optional
            cookies help us understand how the product is used. You can change
            your mind anytime in our{" "}
            <Link href="/cookies" className="underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={handleEssentialOnly}>
            Essential only
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
