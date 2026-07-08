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

  // --- Core tier ---
  "sort-by-age": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function sortUsersByAge(users) {
  // your code here
}

console.log(sortUsersByAge(users));
`,
  },
  "find-first-minor": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function findFirstMinor(users) {
  // your code here
}

console.log(findFirstMinor(users));
`,
  },
  "find-index-first-minor": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function findFirstMinorIndex(users) {
  // your code here
}

console.log(findFirstMinorIndex(users));
`,
  },
  "some-has-minor": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function hasMinor(users) {
  // your code here
}

console.log(hasMinor(users));
`,
  },
  "every-all-adults": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function allAdults(users) {
  // your code here
}

console.log(allAdults(users));
`,
  },
  "includes-has-admin": {
    path: "solution.js",
    content: `const roles = ['editor', 'viewer', 'admin'];

function hasAdmin(roles) {
  // your code here
}

console.log(hasAdmin(roles));
`,
  },

  // --- Math builtins ---
  "math-max-age": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getMaxAge(users) {
  // your code here
}

console.log(getMaxAge(users));
`,
  },
  "math-min-age": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getMinAge(users) {
  // your code here
}

console.log(getMinAge(users));
`,
  },

  // --- Extended tier ---
  "reduce-oldest-user": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getOldestUser(users) {
  // your code here
}

console.log(getOldestUser(users));
`,
  },
  "reduce-group-by-adult-status": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function groupByAdultStatus(users) {
  // your code here
}

console.log(groupByAdultStatus(users));
`,
  },
  "reduce-frequency-last-names": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];

function countLastNames(users) {
  // your code here
}

console.log(countLastNames(users));
`,
  },
  "flatmap-all-tags": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', tags: ['admin', 'editor'] },
  { firstName: 'John', tags: ['viewer'] }
];

function getAllTags(users) {
  // your code here
}

console.log(getAllTags(users));
`,
  },

  // --- Advanced tier ---
  "set-unique-last-names": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];

function getUniqueLastNames(users) {
  // your code here
}

console.log(getUniqueLastNames(users));
`,
  },
  "chain-adult-full-names": {
    path: "solution.js",
    content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getAdultFullNames(users) {
  // your code here
}

console.log(getAdultFullNames(users));
`,
  },
  "object-entries-high-scores": {
    path: "solution.js",
    content: `const scores = { Jane: 85, John: 72, Bob: 91 };

function getHighScorers(scores) {
  // your code here
}

console.log(getHighScorers(scores));
`,
  },
  "closure-create-counter": {
    path: "solution.js",
    content: `function createCounter(start) {
  // your code here
}

const counterA = createCounter(10);
const counterB = createCounter(0);
counterA();
counterA();
counterB();
console.log(JSON.stringify([counterA(), counterB(), counterB()]));
`,
  },
  "curry-generic": {
    path: "solution.js",
    content: `function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  // your code here
}

const curriedAdd = curry(add);
console.log(JSON.stringify([
  curriedAdd(1)(2)(3),
  curriedAdd(1, 2)(3),
  curriedAdd(1)(2, 3),
  typeof curriedAdd(1),
  typeof curriedAdd(1)(2),
]));
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
