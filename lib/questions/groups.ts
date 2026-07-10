import type { QuestionGroup, QuestionGroupId } from "@/lib/questions/types";

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "map-filter-reduce",
    label: "Map, Filter & Reduce",
    description: "Transform arrays with map(), filter(), and reduce()",
    questionIds: ["map-full-names", "filter-adults", "reduce-total-age"],
  },
  {
    id: "search-and-sort",
    label: "Search & Sort",
    description: "Find, test, and order elements with sort(), find(), some(), every()",
    questionIds: [
      "sort-by-age",
      "find-first-minor",
      "find-index-first-minor",
      "some-has-minor",
      "every-all-adults",
      "includes-has-admin",
    ],
  },
  {
    id: "aggregation-and-collections",
    label: "Aggregation & Collections",
    description: "Aggregate data with Math, reduce(), and flatMap()",
    questionIds: [
      "math-max-age",
      "math-min-age",
      "reduce-oldest-user",
      "reduce-group-by-adult-status",
      "reduce-frequency-last-names",
      "flatmap-all-tags",
    ],
  },
  {
    id: "functional-javascript",
    label: "Functional JavaScript",
    description: "Set, chaining, Object.entries, closures, and currying",
    questionIds: [
      "set-unique-last-names",
      "chain-adult-full-names",
      "object-entries-high-scores",
      "closure-create-counter",
      "curry-generic",
    ],
  },
  {
    id: "react-hooks",
    label: "React Hooks",
    description: "Core React hooks with live preview",
    defaultChallengeMinutes: 5,
    questionIds: [
      "react-use-state",
      "react-use-effect",
      "react-use-ref",
      "react-use-context",
      "react-use-reducer",
    ],
  },
];

export function getAllQuestionGroups(): QuestionGroup[] {
  return QUESTION_GROUPS;
}

export function getQuestionGroupById(
  id: QuestionGroupId,
): QuestionGroup | undefined {
  return QUESTION_GROUPS.find((group) => group.id === id);
}

export function getQuestionCountForGroup(id: QuestionGroupId): number {
  return getQuestionGroupById(id)?.questionIds.length ?? 0;
}

export function getDefaultChallengeMinutesForGroup(
  id: QuestionGroupId,
): number | undefined {
  return getQuestionGroupById(id)?.defaultChallengeMinutes;
}
