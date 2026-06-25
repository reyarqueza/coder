import type { CodingQuestion } from "@/lib/questions/types";

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: "map-full-names",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, write a function using map() that returns a new array containing only the users' full names provided the following. Save your solution in solution.js and console.log the result array.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' }
];`,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout: '["Jane Doe","John Smith"]',
      normalize: "json",
    },
  },
  {
    id: "filter-adults",
    sections: [
      {
        type: "text",
        content:
          "Given an array of user objects, use filter() to return a new array containing only the users who are over 18 years old. Save your solution in solution.js and console.log the result array.",
      },
      {
        type: "code",
        content: `const users = [
  { firstName: 'Jane', lastName: 'Doe', age: 25 },
  { firstName: 'John', lastName: 'Smith', age: 17 },
  { firstName: 'Bob', lastName: 'Brown', age: 30 }
];`,
      },
    ],
    validation: {
      entryFile: "solution.js",
      expectedStdout:
        '[{"firstName":"Jane","lastName":"Doe","age":25},{"firstName":"Bob","lastName":"Brown","age":30}]',
      normalize: "json",
    },
  },
];

export function getQuestionById(id: string): CodingQuestion | undefined {
  return CODING_QUESTIONS.find((question) => question.id === id);
}

export function getQuestionDisplayText(question: CodingQuestion): string {
  return question.sections.map((section) => section.content).join("\n\n");
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
