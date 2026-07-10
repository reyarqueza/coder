"use client";

import { DashboardTypewriterSections } from "@/components/dashboard-typewriter-sections";
import { pressStart2P } from "@/lib/fonts/press-start-2p";
import type { QuestionSection } from "@/lib/questions/types";
import { cn } from "@/lib/utils";

const BLANK_APP = `export default function App() {
  return <div></div>;
}`;

export const REACT_HOOKS_SETUP_SECTIONS: QuestionSection[] = [
  {
    type: "text",
    content:
      "Before the quiz begins, scaffold a React app with Vite using the terminal below.",
  },
  {
    type: "text",
    content: "1. Scaffold a React app named my-app:",
  },
  {
    type: "code",
    content: "npm create vite@latest my-app -- --template react",
    lineNumbers: false,
  },
  {
    type: "text",
    content: "2. Install dependencies and start the dev server:",
  },
  {
    type: "code",
    content: "cd my-app && npm install && npm run dev",
    lineNumbers: false,
  },
  {
    type: "text",
    content:
      "3. Confirm the dev server is running — look for a local URL in the terminal output.",
  },
  {
    type: "text",
    content:
      "4. Replace src/App.jsx with a blank component (you can use the editor after clicking Start):",
  },
  {
    type: "code",
    content: BLANK_APP,
  },
  {
    type: "text",
    content:
      "5. Clear src/App.css (optional).\n\nWhen ready, click Start to begin the quiz.",
  },
];

type DashboardGroupSetupProps = {
  active: boolean;
  onComplete?: () => void;
};

export function DashboardGroupSetup({
  active,
  onComplete,
}: DashboardGroupSetupProps) {
  return (
    <div className="space-y-2">
      {active ? (
        <p
          className={cn(
            pressStart2P.className,
            "text-sm leading-relaxed text-muted-foreground",
          )}
        >
          Setup
        </p>
      ) : null}
      <DashboardTypewriterSections
        sections={REACT_HOOKS_SETUP_SECTIONS}
        active={active}
        sectionKey="react-hooks-setup"
        onComplete={onComplete}
        ariaLabel="Setup instructions"
      />
    </div>
  );
}
