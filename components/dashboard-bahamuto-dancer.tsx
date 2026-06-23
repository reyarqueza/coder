"use client";

import { useEffect, useRef, useState } from "react";
import {
  BAHAMUTO_SPRITE_WIDTH,
  BAHAMUTO_STEP_PX,
  CoderBahamutoSprite,
  type BahamutoFacing,
  type BahamutoPose,
} from "@/components/coder-bahamuto-sprite";

type DashboardBahamutoDancerProps = {
  started: boolean;
  playing: boolean;
  failed: boolean;
  succeeded: boolean;
};

export function DashboardBahamutoDancer({
  started,
  playing,
  failed,
  succeeded,
}: DashboardBahamutoDancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pose, setPose] = useState<BahamutoPose>("stand");
  const [step, setStep] = useState(0);
  const [facing, setFacing] = useState<BahamutoFacing>("right");

  const maxStep = Math.max(
    0,
    Math.floor((containerWidth - BAHAMUTO_SPRITE_WIDTH) / BAHAMUTO_STEP_PX),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setStep((current) => Math.min(current, maxStep));
  }, [maxStep]);

  useEffect(() => {
    if (!started || !playing || failed || succeeded) return;

    const intervalId = window.setInterval(() => {
      setPose((current) => (current === "stand" ? "jack" : "stand"));
      setStep((current) => {
        const direction = directionRef.current;
        const next = current + direction;

        if (next >= maxStep) {
          directionRef.current = -1;
          setFacing("left");
          return maxStep;
        }

        if (next <= 0) {
          directionRef.current = 1;
          setFacing("right");
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [started, playing, failed, succeeded, maxStep]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-16 min-h-16 min-w-0 flex-1 items-end overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-0 flex items-end gap-3"
        style={{ transform: `translateX(${step * BAHAMUTO_STEP_PX}px)` }}
      >
        <CoderBahamutoSprite
          pose={failed || succeeded ? "stand" : started ? pose : "stand"}
          facing={facing}
          variant={failed ? "fail" : "default"}
        />
        {failed ? (
          <span className="pb-1 text-4xl font-black tracking-wider text-red-500">
            FAIL
          </span>
        ) : null}
        {succeeded ? (
          <span className="pb-1 text-2xl font-black tracking-wide text-green-500 sm:text-3xl">
            CONGRATULATIONS!
          </span>
        ) : null}
      </div>
    </div>
  );
}
