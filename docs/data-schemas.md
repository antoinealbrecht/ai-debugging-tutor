# AI Debugging Tutor — Data Schemas

## Purpose

This document defines the core data structures used by AI Debugging Tutor.

These schemas describe how the system represents:

- errors
- code locations
- hidden diagnoses
- resources
- debugging lessons
- user answers
- tutor feedback
- code-change evaluations
- final learning reports
- learning history

The goal is to make the tutor predictable, testable, and easier to build.

---

## Code Location

A `CodeLocation` represents a specific location in the user’s repository.

```ts
export type CodeLocation = {
  filePath: string;
  lineStart: number;
  lineEnd: number;
  columnStart?: number;
  columnEnd?: number;
  symbolName?: string;
};
```

Example:

```ts
const location: CodeLocation = {
  filePath: "src/app/page.tsx",
  lineStart: 4,
  lineEnd: 4,
  columnStart: 18,
  columnEnd: 42,
  symbolName: "StatCard",
};
```

---

## Supported Error Category

V1 focuses on JavaScript and TypeScript-related errors.

```ts
export type SupportedErrorCategory =
  | "import_module_resolution"
  | "typescript_type_error"
  | "nullability_error"
  | "function_signature_error"
  | "react_hook_error"
  | "nextjs_server_client_error"
  | "async_logic_error"
  | "prisma_schema_client_mismatch"
  | "state_update_error"
  | "configuration_error"
  | "unknown";
```

---

## Parsed Error

A `ParsedError` is the structured version of the raw error message.

```ts
export type ParsedError = {
  rawMessage: string;
  category: SupportedErrorCategory;
  source: "problems_panel" | "terminal" | "selected_text" | "manual_input";

  filePath?: string;
  line?: number;
  column?: number;

  errorCode?: string;
  symbolName?: string;

  stackFrames?: CodeLocation[];

  expectedType?: string;
  actualType?: string;

  frameworkClues?: string[];
};
```

Example:

```ts
const parsedError: ParsedError = {
  rawMessage: "Cannot find module '@/components/StatCard'",
  category: "import_module_resolution",
  source: "terminal",
  filePath: "src/app/page.tsx",
  line: 4,
  column: 18,
  symbolName: "StatCard",
  frameworkClues: ["Next.js", "TypeScript"],
};
```

---

## Repository Context

`RepositoryContext` contains only the relevant code and metadata selected for the current tutoring session.

The tutor should not receive the entire repository blindly.

```ts
export type RepositoryContext = {
  rootPath: string;

  relevantFiles: RelevantFile[];

  imports: ImportRelationship[];

  symbols: SymbolReference[];

  configFiles: RelevantFile[];

  retrievalReasoning: RetrievalSignal[];
};
```

---

## Relevant File

```ts
export type RelevantFile = {
  filePath: string;
  language: "javascript" | "typescript" | "jsx" | "tsx" | "json" | "other";

  contentSnippet: string;

  lineStart: number;
  lineEnd: number;

  reasonIncluded: string;
};
```

Example:

```ts
const file: RelevantFile = {
  filePath: "src/app/page.tsx",
  language: "tsx",
  contentSnippet: "import { StatCard } from '@/components/StatCard';",
  lineStart: 1,
  lineEnd: 10,
  reasonIncluded: "This file contains the import mentioned in the error.",
};
```

---

## Import Relationship

```ts
export type ImportRelationship = {
  fromFile: string;
  importedPath: string;
  resolvedFile?: string;
  importedSymbols: string[];
  isResolved: boolean;
};
```

---

## Symbol Reference

```ts
export type SymbolReference = {
  name: string;
  kind:
    | "function"
    | "class"
    | "component"
    | "type"
    | "interface"
    | "variable"
    | "constant"
    | "unknown";

  definedIn: CodeLocation;
  exported: boolean;
};
```

---

## Retrieval Signal

A `RetrievalSignal` explains why a piece of context was selected.

```ts
export type RetrievalSignal = {
  type:
    | "exact_file_path"
    | "line_number"
    | "symbol_match"
    | "import_graph"
    | "ast_relationship"
    | "keyword_match"
    | "semantic_similarity"
    | "neighboring_code"
    | "config_file"
    | "previous_session_step";

  description: string;
  confidence: "high" | "medium" | "low";
};
```

Example:

```ts
const signal: RetrievalSignal = {
  type: "symbol_match",
  description: "The error mentions StatCard, and this symbol appears in src/components/StatCard.tsx.",
  confidence: "high",
};
```

---

## Hidden Bug Diagnosis

The hidden diagnosis is created before the tutor starts teaching.

It should not be shown to the user unless the lesson ends or the user reveals the solution.

```ts
export type BugDiagnosis = {
  rootCause: string;

  confidence: "high" | "medium" | "low";

  relevantLocations: CodeLocation[];

  alternativeCauses: string[];

  expectedFix: string;

  conceptsRequired: string[];

  errorCategory: SupportedErrorCategory;
};
```

Example:

```ts
const diagnosis: BugDiagnosis = {
  rootCause:
    "The import path points to a component location that does not exist from the file doing the importing.",

  confidence: "high",

  relevantLocations: [
    {
      filePath: "src/app/page.tsx",
      lineStart: 4,
      lineEnd: 4,
      symbolName: "StatCard",
    },
  ],

  alternativeCauses: [
    "The component file may be missing.",
    "The component may exist but not be exported correctly.",
    "The path alias may not be configured correctly.",
  ],

  expectedFix:
    "Update the import path or file location so the import resolves to the actual StatCard component.",

  conceptsRequired: [
    "relative imports",
    "module resolution",
    "project structure",
  ],

  errorCategory: "import_module_resolution",
};
```

---

## Resource

Resources are shown before the user starts solving the bug.

Each resource must explain why it matters and what the user should focus on.

```ts
export type Resource = {
  title: string;
  url: string;
  source:
    | "MDN"
    | "TypeScript"
    | "React"
    | "Next.js"
    | "Node.js"
    | "Prisma"
    | "ESLint"
    | "Other";

  reason: string;
  focus: string;

  relatedConcepts: string[];
};
```

Example:

```ts
const resource: Resource = {
  title: "TypeScript Module Resolution",
  url: "https://www.typescriptlang.org/docs/handbook/module-resolution.html",
  source: "TypeScript",
  reason: "This explains how TypeScript finds imported files.",
  focus: "Focus on how relative imports are resolved from the file doing the importing.",
  relatedConcepts: ["module resolution", "relative imports"],
};
```

---

## Debugging Lesson

A `DebuggingLesson` breaks the bug into smaller steps.

```ts
export type DebuggingLesson = {
  objective: string;
  estimatedDifficulty: "beginner" | "intermediate" | "advanced";

  resources: Resource[];

  steps: DebuggingStep[];
};
```

---

## Debugging Step

```ts
export type DebuggingStep = {
  id: string;

  objective: string;

  question: string;

  conceptsRequired: string[];

  hints: ProgressiveHint[];

  completionCriteria: string[];

  relatedLocations: CodeLocation[];
};
```

Example:

```ts
const step: DebuggingStep = {
  id: "step-1",

  objective: "Identify where the import path starts.",

  question:
    "From which folder does TypeScript begin resolving this import?",

  conceptsRequired: ["relative imports"],

  hints: [
    {
      level: 1,
      label: "Direction",
      text: "Relative imports start from the file that contains the import.",
    },
    {
      level: 2,
      label: "Focus",
      text: "Look at the folder containing page.tsx.",
    },
    {
      level: 3,
      label: "Strong clue",
      text: "If page.tsx is inside src/app, the import starts from src/app.",
    },
  ],

  completionCriteria: [
    "User understands that relative imports start from the importing file's directory.",
  ],

  relatedLocations: [
    {
      filePath: "src/app/page.tsx",
      lineStart: 4,
      lineEnd: 4,
    },
  ],
};
```

---

## Progressive Hint

```ts
export type ProgressiveHint = {
  level: 1 | 2 | 3;
  label: "Direction" | "Focus" | "Strong clue";
  text: string;
};
```

The hint levels should behave like this:

```text
Level 1:
Gives a general direction.

Level 2:
Points the user to the specific concept or location.

Level 3:
Gives a strong clue but still avoids directly revealing the final answer.
```

The final solution should only be shown if the user explicitly chooses to reveal it.

---

## User Answer

```ts
export type UserAnswer = {
  stepId: string;
  answerText: string;
  submittedAt: string;
};
```

---

## Step Evaluation

The tutor evaluates the user’s reasoning, not exact wording.

```ts
export type StepEvaluation = {
  status:
    | "correct"
    | "mostly_correct"
    | "partial"
    | "incorrect"
    | "unclear"
    | "clarification_requested";

  whatWasRight: string;

  missingConcepts: string[];

  misconception: string | null;

  nextResponse: string;

  hintGiven?: ProgressiveHint;

  advanceToNextStep: boolean;
};
```

Example:

```ts
const evaluation: StepEvaluation = {
  status: "partial",

  whatWasRight:
    "You correctly noticed that the problem is related to the import path.",

  missingConcepts: [
    "Relative imports start from the file doing the importing.",
  ],

  misconception:
    "You treated the import as if it starts from the project root.",

  nextResponse:
    "Good start. Now focus on the file that contains the import. From that file's folder, what path does './components/StatCard' create?",

  hintGiven: {
    level: 1,
    label: "Direction",
    text: "Relative imports start from the file that contains the import.",
  },

  advanceToNextStep: false,
};
```

---

## Code Change Evaluation

The user edits their own code, then asks the tutor to check the change.

The tutor should inspect the relevant diff.

```ts
export type CodeChangeEvaluation = {
  status:
    | "fixes_root_cause"
    | "partially_fixes_root_cause"
    | "does_not_fix_root_cause"
    | "introduces_new_issue"
    | "unclear";

  explanation: string;

  changedLocations: CodeLocation[];

  newIssuesIntroduced: string[];

  stillMissing: string[];

  userLikelyUnderstandsFix: boolean;

  advanceLesson: boolean;
};
```

Example:

```ts
const codeChangeEvaluation: CodeChangeEvaluation = {
  status: "fixes_root_cause",

  explanation:
    "The import now points to the actual StatCard component location, so the module can be resolved correctly.",

  changedLocations: [
    {
      filePath: "src/app/page.tsx",
      lineStart: 4,
      lineEnd: 4,
    },
  ],

  newIssuesIntroduced: [],

  stillMissing: [],

  userLikelyUnderstandsFix: true,

  advanceLesson: true,
};
```

---

## Final Learning Report

The final report is generated after the bug is solved or the solution is revealed.

```ts
export type FinalLearningReport = {
  sessionResult: "self_solved" | "solution_revealed" | "abandoned";

  rootCause: string;

  finalSolution: string;

  whatYouDidWell: string[];

  whereYouStruggled: string[];

  conceptsReinforced: string[];

  recommendedReview: RecommendedReview[];

  hintSummary: HintSummary;
};
```

---

## Recommended Review

```ts
export type RecommendedReview = {
  title: string;
  url: string;
  reason: string;
};
```

---

## Hint Summary

```ts
export type HintSummary = {
  totalHintsUsed: number;

  strongestHintUsed: 0 | 1 | 2 | 3;

  conceptsThatNeededHints: string[];
};
```

Example:

```ts
const report: FinalLearningReport = {
  sessionResult: "self_solved",

  rootCause:
    "The import path did not match the actual file location of the component.",

  finalSolution:
    "Updated the import path so it correctly resolves from src/app/page.tsx to the StatCard component.",

  whatYouDidWell: [
    "You correctly identified that the issue was related to module resolution.",
    "You checked the file structure instead of guessing randomly.",
  ],

  whereYouStruggled: [
    "You initially treated the import as if it started from the project root.",
  ],

  conceptsReinforced: [
    "relative imports",
    "TypeScript module resolution",
    "Next.js project structure",
  ],

  recommendedReview: [
    {
      title: "TypeScript Module Resolution",
      url: "https://www.typescriptlang.org/docs/handbook/module-resolution.html",
      reason: "Review how TypeScript resolves relative imports.",
    },
  ],

  hintSummary: {
    totalHintsUsed: 1,
    strongestHintUsed: 1,
    conceptsThatNeededHints: ["relative imports"],
  },
};
```

---

## Debugging Session

A `DebuggingSession` stores the full tutoring session.

```ts
export type DebuggingSession = {
  id: string;

  startedAt: string;
  endedAt?: string;

  parsedError: ParsedError;

  repositoryContext: RepositoryContext;

  hiddenDiagnosis: BugDiagnosis;

  lesson: DebuggingLesson;

  currentStepId: string;

  answers: UserAnswer[];

  evaluations: StepEvaluation[];

  codeChangeEvaluations: CodeChangeEvaluation[];

  finalReport?: FinalLearningReport;

  status:
    | "in_progress"
    | "self_solved"
    | "solution_revealed"
    | "abandoned";
};
```

---

## Concept Progress

The tutor should track repeated concepts across sessions.

```ts
export type ConceptProgress = {
  concept: string;

  status: "strong" | "improving" | "needs_review";

  timesEncountered: number;

  timesSolvedWithoutHint: number;

  timesHinted: number;

  timesSolutionRevealed: number;

  lastEncounteredAt: string;
};
```

Example:

```ts
const conceptProgress: ConceptProgress = {
  concept: "relative imports",

  status: "improving",

  timesEncountered: 3,

  timesSolvedWithoutHint: 1,

  timesHinted: 2,

  timesSolutionRevealed: 0,

  lastEncounteredAt: "2026-07-06T18:30:00.000Z",
};
```

---

## Learning Profile

```ts
export type LearningProfile = {
  userId: string;

  bugsSolved: number;

  sessionsCompleted: number;

  sessionsRevealed: number;

  concepts: ConceptProgress[];

  repeatedMisconceptions: string[];
};
```

---

## Privacy Rules

The data schemas should support privacy by design.

V1 should follow these rules:

- Do not send the entire repository blindly.
- Send only retrieved snippets when possible.
- Redact likely secrets before sending context.
- Avoid storing source code by default.
- Store learning history separately from raw code.
- Let users delete sessions.
- Do not train on user repositories.
- Do not execute arbitrary user code in V1.

---

## V1 Schema Priorities

The most important schemas for the first working prototype are:

1. `ParsedError`
2. `BugDiagnosis`
3. `Resource`
4. `DebuggingLesson`
5. `DebuggingStep`
6. `StepEvaluation`
7. `CodeChangeEvaluation`
8. `FinalLearningReport`
9. `DebuggingSession`

These are the minimum structures needed to build the tutor loop.