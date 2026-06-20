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
};

export function DashboardBahamutoDancer({
  started,
  playing,
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
    if (!started || !playing) return;

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
  }, [started, playing, maxStep]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="relative h-16 min-h-16 min-w-0 flex-1 overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-0"
        style={{ transform: `translateX(${step * BAHAMUTO_STEP_PX}px)` }}
      >
        <CoderBahamutoSprite
          pose={started ? pose : "stand"}
          facing={facing}
        />
      </div>
    </div>
  );
}
