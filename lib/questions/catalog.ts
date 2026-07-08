import { getQuestionGroupById } from "@/lib/questions/groups";
import type { CodingQuestion, QuestionGroupId } from "@/lib/questions/types";

const SOLUTION_INSTRUCTION =
  "Type your solution in solution.js. You have the option to run node in the terminal to test your work before you Check your Answer.";

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: "map-full-names",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, write a function using map() that returns a new array containing only the users' full names provided the following.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '["Jane Doe","John Smith"]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use map() to transform each user into a full name by combining firstName and lastName in a template string.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' }
];

function getFullNames(users) {
  return users.map((user) => \`\${user.firstName} \${user.lastName}\`);
}

console.log(getFullNames(users));`,
      },
    ],
  },
  {
    id: "filter-adults",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use filter() to return a new array containing only the users who are over 18 years old.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '[{"firstName":"Jane","lastName":"Doe","age":25},{"firstName":"Bob","lastName":"Brown","age":30}]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use filter() to keep only users whose age is greater than 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getAdultUsers(users) {
  return users.filter((user) => user.age > 18);
}

console.log(getAdultUsers(users));`,
      },
    ],
  },
  {
    id: "reduce-total-age",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use reduce() to return the total sum of all users' ages.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "72",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Use reduce() to add up each user's age, starting from 0.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getTotalAge(users) {
  return users.reduce((total, user) => total + user.age, 0);
}

console.log(getTotalAge(users));`,
      },
    ],
  },

  // --- Core tier ---
  {
    id: "sort-by-age",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use sort() to return a new array of users sorted by age (youngest first). Do not mutate the input array — use the spread operator.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '[{"firstName":"John","lastName":"Smith","age":17},{"firstName":"Jane","lastName":"Doe","age":25},{"firstName":"Bob","lastName":"Brown","age":30}]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Copy the array with spread, then sort with a comparator that subtracts ages.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function sortUsersByAge(users) {
  return [...users].sort((a, b) => a.age - b.age);
}

console.log(sortUsersByAge(users));`,
      },
    ],
  },
  {
    id: "find-first-minor",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use find() to return the first user who is under 18 years old.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '{"firstName":"John","lastName":"Smith","age":17}',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use find() with a predicate that checks if age is less than 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function findFirstMinor(users) {
  return users.find((user) => user.age < 18);
}

console.log(findFirstMinor(users));`,
      },
    ],
  },
  {
    id: "find-index-first-minor",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use findIndex() to return the index of the first user who is under 18 years old.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "1",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Use findIndex() with the same predicate as find() — it returns the position instead of the element.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function findFirstMinorIndex(users) {
  return users.findIndex((user) => user.age < 18);
}

console.log(findFirstMinorIndex(users));`,
      },
    ],
  },
  {
    id: "some-has-minor",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use some() to return whether any user is under 18 years old.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "true",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Use some() to test if at least one user has age less than 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function hasMinor(users) {
  return users.some((user) => user.age < 18);
}

console.log(hasMinor(users));`,
      },
    ],
  },
  {
    id: "every-all-adults",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use every() to return whether every user is over 18 years old.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "false",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Use every() to test if all users have age greater than 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function allAdults(users) {
  return users.every((user) => user.age > 18);
}

console.log(allAdults(users));`,
      },
    ],
  },
  {
    id: "includes-has-admin",
    sections: [
      {
        type: "text",
        content:
          "Given an array of role strings, use includes() to return whether the array includes the role 'admin'.",
      },
      {
        type: "code",
        content: `const roles = ['editor', 'viewer', 'admin'];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "true",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Use includes() to check for membership of the string 'admin' in the array.",
      },
      {
        type: "code",
        content: `const roles = ['editor', 'viewer', 'admin'];

function hasAdmin(roles) {
  return roles.includes('admin');
}

console.log(hasAdmin(roles));`,
      },
    ],
  },

  // --- Math builtins ---
  {
    id: "math-max-age",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use Math.max() to return the highest age. Map users to their ages first, then spread the result into Math.max().",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "30",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Map to ages, then spread into Math.max() to find the highest value.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getMaxAge(users) {
  return Math.max(...users.map((user) => user.age));
}

console.log(getMaxAge(users));`,
      },
    ],
  },
  {
    id: "math-min-age",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use Math.min() to return the lowest age. Map users to their ages first, then spread the result into Math.min().",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "17",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Map to ages, then spread into Math.min() to find the lowest value.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getMinAge(users) {
  return Math.min(...users.map((user) => user.age));
}

console.log(getMinAge(users));`,
      },
    ],
  },

  // --- Extended tier ---
  {
    id: "reduce-oldest-user",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use reduce() to return the user object with the highest age.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '{"firstName":"Bob","lastName":"Brown","age":30}',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use reduce() to compare each user against the accumulator and keep the one with the higher age.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getOldestUser(users) {
  return users.reduce((oldest, user) =>
    user.age > oldest.age ? user : oldest
  );
}

console.log(getOldestUser(users));`,
      },
    ],
  },
  {
    id: "reduce-group-by-adult-status",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use reduce() to group users into an object with adult and minor arrays based on whether age is over 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '{"adult":[{"firstName":"Jane","lastName":"Doe","age":25},{"firstName":"Bob","lastName":"Brown","age":30}],"minor":[{"firstName":"John","lastName":"Smith","age":17}]}',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use reduce() starting from { adult: [], minor: [] }, pushing each user into the correct array.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function groupByAdultStatus(users) {
  return users.reduce(
    (groups, user) => {
      if (user.age > 18) {
        groups.adult.push(user);
      } else {
        groups.minor.push(user);
      }
      return groups;
    },
    { adult: [], minor: [] },
  );
}

console.log(groupByAdultStatus(users));`,
      },
    ],
  },
  {
    id: "reduce-frequency-last-names",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use reduce() to return an object counting how many times each lastName appears.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '{"Doe":2,"Smith":1}',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use reduce() to build a frequency map, incrementing the count for each lastName.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];

function countLastNames(users) {
  return users.reduce((counts, user) => {
    counts[user.lastName] = (counts[user.lastName] || 0) + 1;
    return counts;
  }, {});
}

console.log(countLastNames(users));`,
      },
    ],
  },
  {
    id: "flatmap-all-tags",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects where each user has a tags array, use flatMap() to return a single flat array of all tags.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', tags: ['admin', 'editor'] },
  { firstName: 'John', tags: ['viewer'] }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '["admin","editor","viewer"]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use flatMap() to map each user to their tags array and flatten in one step.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', tags: ['admin', 'editor'] },
  { firstName: 'John', tags: ['viewer'] }
];

function getAllTags(users) {
  return users.flatMap((user) => user.tags);
}

console.log(getAllTags(users));`,
      },
    ],
  },

  // --- Advanced tier ---
  {
    id: "set-unique-last-names",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use a Set to return an array of unique last names.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '["Doe","Smith"]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Map to last names, wrap in new Set() to deduplicate, then spread back into an array.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Doe', age: 30 }
];

function getUniqueLastNames(users) {
  return [...new Set(users.map((user) => user.lastName))];
}

console.log(getUniqueLastNames(users));`,
      },
    ],
  },
  {
    id: "chain-adult-full-names",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, chain filter(), map(), and join() to return a single comma-separated string of full names for users over 18.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "Jane Doe, Bob Brown",
      normalize: "trim",
    },
    solution: [
      {
        type: "text",
        content:
          "Filter adults, map to full names, then join with ', ' to produce one string.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];

function getAdultFullNames(users) {
  return users
    .filter((user) => user.age > 18)
    .map((user) => \`\${user.firstName} \${user.lastName}\`)
    .join(', ');
}

console.log(getAdultFullNames(users));`,
      },
    ],
  },
  {
    id: "object-entries-high-scores",
    sections: [
      {
        type: "text",
        content:
          "Given an object mapping names to scores, use Object.entries() to return an array of names whose score is 80 or higher.",
      },
      {
        type: "code",
        content: `const scores = { Jane: 85, John: 72, Bob: 91 };`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '["Jane","Bob"]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use Object.entries() to get [name, score] pairs, filter by score, then map to names.",
      },
      {
        type: "code",
        content: `const scores = { Jane: 85, John: 72, Bob: 91 };

function getHighScorers(scores) {
  return Object.entries(scores)
    .filter(([, score]) => score >= 80)
    .map(([name]) => name);
}

console.log(getHighScorers(scores));`,
      },
    ],
  },
  {
    id: "closure-create-counter",
    sections: [
      {
        type: "text",
        content:
          "Implement createCounter(start) that returns a function. Each call increments an internal count (starting at start) and returns the new value.",
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: "[13,2,3]",
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Use a closure to keep count private. The returned function increments count and returns the new value.",
      },
      {
        type: "code",
        content: `function createCounter(start) {
  let count = start;
  return function () {
    count += 1;
    return count;
  };
}

const counterA = createCounter(10);
const counterB = createCounter(0);
counterA();
counterA();
counterB();
console.log(JSON.stringify([counterA(), counterB(), counterB()]));`,
      },
    ],
  },
  {
    id: "curry-generic",
    sections: [
      {
        type: "text",
        content:
          "Implement curry(fn) so a function of any arity can be called as f(a)(b)(c) or with grouped args like f(a, b)(c).",
      },
      {
        type: "code",
        content: `function add(a, b, c) {
  return a + b + c;
}`,
      },
      {
        type: "text",
        content: SOLUTION_INSTRUCTION,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '[6,6,6,"function","function"]',
      normalize: "json",
    },
    solution: [
      {
        type: "text",
        content:
          "Return a curried wrapper that collects args until fn.length is reached, then calls the original function.",
      },
      {
        type: "code",
        content: `function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...next) => curried(...args, ...next);
  };
}

const curriedAdd = curry(add);
console.log(JSON.stringify([
  curriedAdd(1)(2)(3),
  curriedAdd(1, 2)(3),
  curriedAdd(1)(2, 3),
  typeof curriedAdd(1),
  typeof curriedAdd(1)(2),
]));`,
      },
    ],
  },
];

export function getQuestionById(id: string): CodingQuestion | undefined {
  return CODING_QUESTIONS.find((question) => question.id === id);
}

export function getSectionsDisplayText(sections: CodingQuestion["sections"]) {
  return sections.map((section) => section.content).join("\n\n");
}

export function getQuestionDisplayText(question: CodingQuestion): string {
  return getSectionsDisplayText(question.sections);
}

export function getDefaultQuestion(): CodingQuestion {
  return CODING_QUESTIONS[0];
}

export function getQuestionAtIndex(index: number): CodingQuestion {
  return CODING_QUESTIONS[index] ?? CODING_QUESTIONS[0];
}

export function hasNextQuestion(index: number): boolean {
  return index + 1 < CODING_QUESTIONS.length;
}

export function getTotalQuestionCount(): number {
  return CODING_QUESTIONS.length;
}

export function isLastQuestion(index: number): boolean {
  return index >= CODING_QUESTIONS.length - 1;
}

function getGroupQuestions(groupId: QuestionGroupId): CodingQuestion[] {
  const group = getQuestionGroupById(groupId);
  if (!group) return [];

  return group.questionIds
    .map((id) => getQuestionById(id))
    .filter((question): question is CodingQuestion => question !== undefined);
}

export function getQuestionsForGroup(groupId: QuestionGroupId): CodingQuestion[] {
  return getGroupQuestions(groupId);
}

export function getQuestionAtIndexForGroup(
  groupId: QuestionGroupId,
  index: number,
): CodingQuestion {
  const questions = getGroupQuestions(groupId);
  return questions[index] ?? questions[0];
}

export function hasNextQuestionInGroup(
  groupId: QuestionGroupId,
  index: number,
): boolean {
  return index + 1 < getGroupQuestions(groupId).length;
}

export function getTotalQuestionCountForGroup(groupId: QuestionGroupId): number {
  return getGroupQuestions(groupId).length;
}

export function isLastQuestionInGroup(
  groupId: QuestionGroupId,
  index: number,
): boolean {
  const questions = getGroupQuestions(groupId);
  return index >= questions.length - 1;
}
