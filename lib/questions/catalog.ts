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
