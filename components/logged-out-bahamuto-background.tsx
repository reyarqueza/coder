"use client";

import { useEffect, useState } from "react";
import {
  CoderBahamutoSprite,
  type BahamutoPose,
} from "@/components/coder-bahamuto-sprite";

export function LoggedOutBahamutoBackground() {
  const [pose, setPose] = useState<BahamutoPose>("stand");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPose((current) => (current === "stand" ? "jack" : "stand"));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <div className="scale-[10] opacity-[0.08] dark:opacity-[0.12]">
        <CoderBahamutoSprite pose={pose} facing="right" />
      </div>
    </div>
  );
}
