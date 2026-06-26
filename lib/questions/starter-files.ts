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
  "filter-adults": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getAdultUsers(users) {
  // your code here
}

console.log(getAdultUsers(users));
`,
  },
  "reduce-total-age": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getTotalAge(users) {
  // your code here
}

console.log(getTotalAge(users));
`,
  },
};

export async function seedQuestionStarterFile(
  webcontainer: WebContainer,
  question: CodingQuestion,
  options?: { force?: boolean },
): Promise<string | null> {
  const starter = STARTER_FILES[question.id];
  if (!starter) return null;

  if (!options?.force) {
    try {
      await webcontainer.fs.readFile(starter.path, "utf-8");
      return starter.path;
    } catch {
      // file does not exist yet
    }
  }

  await webcontainer.fs.writeFile(starter.path, starter.content);
  return starter.path;
}
