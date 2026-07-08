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
  solution: QuestionSection[];
  validation: QuestionValidation;
};

export type QuestionGroupId =
  | "map-filter-reduce"
  | "search-and-sort"
  | "aggregation-and-collections"
  | "functional-javascript";

export type QuestionGroup = {
  id: QuestionGroupId;
  label: string;
  description: string;
  questionIds: string[];
};
