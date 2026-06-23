import type { CodingQuestion } from "@/lib/questions/types";
import type { WebContainer } from "@webcontainer/api";

const STARTER_FILES: Record<string, { path: string; content: string }> = {
  "map-full-names": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' }
];

function getFullNames(users) {
  // your code here
}

console.log(getFullNames(users));
`,
  },
};

export async function seedQuestionStarterFile(
  webcontainer: WebContainer,
  question: CodingQuestion,
): Promise<string | null> {
  const starter = STARTER_FILES[question.id];
  if (!starter) return null;

  try {
    await webcontainer.fs.readFile(starter.path, "utf-8");
    return starter.path;
  } catch {
    await webcontainer.fs.writeFile(starter.path, starter.content);
    return starter.path;
  }
}
