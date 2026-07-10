export type QuestionSection =
  | { type: "text"; content: string }
  | { type: "code"; content: string; lineNumbers?: boolean };

export type ReactFileContainsCheck = {
  kind: "file-contains";
  path: string;
  patterns: string[];
};

export type ReactPreviewTextCheck = {
  kind: "preview-text";
  testId: string;
  expected: string;
};

export type ReactCheck = ReactFileContainsCheck | ReactPreviewTextCheck;

export type StdoutValidation = {
  type?: "stdout";
  entryFile: string;
  expectedStdout: string;
  normalize?: "trim" | "json";
};

export type ReactPreviewValidation = {
  type: "react-preview";
  appDir: string;
  checks: ReactCheck[];
};

export type QuestionValidation = StdoutValidation | ReactPreviewValidation;

export function isReactPreviewValidation(
  validation: QuestionValidation,
): validation is ReactPreviewValidation {
  return validation.type === "react-preview";
}

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
  | "functional-javascript"
  | "react-hooks";

export type QuestionGroup = {
  id: QuestionGroupId;
  label: string;
  description: string;
  questionIds: string[];
  defaultChallengeMinutes?: number;
};
