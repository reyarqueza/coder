export type QuestionSection =
  | { type: "text"; content: string }
  | { type: "code"; content: string };

export type QuestionValidation = {
  entryFile: string;
  expectedStdout: string;
  normalize?: "trim" | "json";
};

export type CodingQuestion = {
  id: string;
  sections: QuestionSection[];
  validation: QuestionValidation;
};
