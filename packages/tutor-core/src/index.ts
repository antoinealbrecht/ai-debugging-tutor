import type {
  CodeChangeEvaluation,
  DebuggingSession,
  DebuggingStep,
  FinalLearningReport,
  ProgressiveHint,
  StepEvaluation,
  UserAnswer,
} from "@ai-debugging-tutor/shared";

export function createDemoImportErrorSession(
  startedAt: string = new Date().toISOString(),
): DebuggingSession {
  return {
    id: "demo-import-error-001",

    startedAt,

    parsedError: {
      rawMessage: "Cannot find module '@/components/StatCard'",
      category: "import_module_resolution",
      source: "terminal",
      filePath: "src/app/page.tsx",
      line: 4,
      column: 18,
      symbolName: "StatCard",
      frameworkClues: ["Next.js", "TypeScript"],
    },

    repositoryContext: {
      rootPath: "demo-next-app",

      relevantFiles: [
        {
          filePath: "src/app/page.tsx",
          language: "tsx",
          contentSnippet: [
            "import { StatCard } from '@/components/StatCard';",
            "",
            "export default function Page() {",
            "  return <StatCard title=\"Users\" value=\"120\" />;",
            "}",
          ].join("\n"),
          lineStart: 1,
          lineEnd: 5,
          reasonIncluded: "This file contains the broken import mentioned in the error.",
        },
        {
          filePath: "src/app/components/StatCard.tsx",
          language: "tsx",
          contentSnippet: [
            "type StatCardProps = {",
            "  title: string;",
            "  value: string;",
            "};",
            "",
            "export function StatCard({ title, value }: StatCardProps) {",
            "  return <div>{title}: {value}</div>;",
            "}",
          ].join("\n"),
          lineStart: 1,
          lineEnd: 8,
          reasonIncluded: "This file defines the StatCard component.",
        },
      ],

      imports: [
        {
          fromFile: "src/app/page.tsx",
          importedPath: "@/components/StatCard",
          importedSymbols: ["StatCard"],
          isResolved: false,
        },
      ],

      symbols: [
        {
          name: "StatCard",
          kind: "component",
          definedIn: {
            filePath: "src/app/components/StatCard.tsx",
            lineStart: 6,
            lineEnd: 8,
            symbolName: "StatCard",
          },
          exported: true,
        },
      ],

      configFiles: [
        {
          filePath: "tsconfig.json",
          language: "json",
          contentSnippet: [
            "{",
            "  \"compilerOptions\": {",
            "    \"baseUrl\": \".\"",
            "  }",
            "}",
          ].join("\n"),
          lineStart: 1,
          lineEnd: 5,
          reasonIncluded: "This config affects path alias resolution.",
        },
      ],

      retrievalReasoning: [
        {
          type: "exact_file_path",
          description: "The error points directly to src/app/page.tsx.",
          confidence: "high",
        },
        {
          type: "symbol_match",
          description: "The error mentions StatCard, which is defined in src/app/components/StatCard.tsx.",
          confidence: "high",
        },
        {
          type: "import_graph",
          description: "The import path in src/app/page.tsx does not resolve to the discovered component file.",
          confidence: "high",
        },
      ],
    },

    hiddenDiagnosis: {
      rootCause:
        "The import path uses the @ alias as if StatCard is located at src/components/StatCard, but the component is actually located at src/app/components/StatCard.tsx.",

      confidence: "high",

      relevantLocations: [
        {
          filePath: "src/app/page.tsx",
          lineStart: 1,
          lineEnd: 1,
          symbolName: "StatCard",
        },
        {
          filePath: "src/app/components/StatCard.tsx",
          lineStart: 6,
          lineEnd: 8,
          symbolName: "StatCard",
        },
      ],

      alternativeCauses: [
        "The path alias may be configured incorrectly.",
        "The component file may have been moved.",
        "The component may not be exported correctly.",
      ],

      expectedFix:
        "Update the import so it points from src/app/page.tsx to src/app/components/StatCard.tsx, such as './components/StatCard'.",

      conceptsRequired: [
        "module resolution",
        "path aliases",
        "relative imports",
        "Next.js project structure",
      ],

      errorCategory: "import_module_resolution",
    },

    lesson: {
      objective:
        "Fix the broken StatCard import by understanding how TypeScript and Next.js resolve module paths.",

      estimatedDifficulty: "beginner",

      resources: [
        {
          title: "TypeScript Module Resolution",
          url: "https://www.typescriptlang.org/docs/handbook/modules/reference.html",
          source: "TypeScript",
          reason: "This explains how TypeScript resolves import paths.",
          focus: "Focus on the difference between relative imports and non-relative path aliases.",
          relatedConcepts: ["module resolution", "relative imports", "path aliases"],
        },
        {
          title: "Next.js Project Structure",
          url: "https://nextjs.org/docs/app/getting-started/project-structure",
          source: "Next.js",
          reason: "This explains common file organization in a Next.js app directory project.",
          focus: "Focus on where files inside src/app are located relative to each other.",
          relatedConcepts: ["Next.js project structure"],
        },
      ],

      steps: [
        {
          id: "step-1",
          objective: "Identify what kind of import is failing.",
          question:
            "Is '@/components/StatCard' a relative import or a path-alias import? How can you tell?",
          conceptsRequired: ["relative imports", "path aliases"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "Look at the first character of the import path.",
            },
            {
              level: 2,
              label: "Focus",
              text: "Relative imports usually start with ./ or ../.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "The @ symbol usually means the project configured an alias.",
            },
          ],
          completionCriteria: [
            "User understands that '@/components/StatCard' is a path-alias import, not a relative import.",
          ],
          relatedLocations: [
            {
              filePath: "src/app/page.tsx",
              lineStart: 1,
              lineEnd: 1,
            },
          ],
        },
        {
          id: "step-2",
          objective: "Compare the import path to the actual component location.",
          question:
            "The component exists at src/app/components/StatCard.tsx. What location does '@/components/StatCard' appear to be trying to reach?",
          conceptsRequired: ["module resolution", "path aliases"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "Think about what @ usually points to in many TypeScript projects.",
            },
            {
              level: 2,
              label: "Focus",
              text: "If @ points to src, then '@/components/StatCard' points inside src/components.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "The import appears to point to src/components/StatCard, but the file is under src/app/components.",
            },
          ],
          completionCriteria: [
            "User identifies that the alias import does not match the actual file location.",
          ],
          relatedLocations: [
            {
              filePath: "src/app/page.tsx",
              lineStart: 1,
              lineEnd: 1,
            },
            {
              filePath: "src/app/components/StatCard.tsx",
              lineStart: 6,
              lineEnd: 8,
            },
          ],
        },
        {
          id: "step-3",
          objective: "Choose the correct fix.",
          question:
            "Given that page.tsx and the components folder are both inside src/app, what import path would correctly reach StatCard?",
          conceptsRequired: ["relative imports", "project structure"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "Start from the folder containing page.tsx.",
            },
            {
              level: 2,
              label: "Focus",
              text: "page.tsx is inside src/app, and components is also inside src/app.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "From src/app/page.tsx, the components folder is directly next to the file.",
            },
          ],
          completionCriteria: [
            "User chooses './components/StatCard' as the correct import path.",
          ],
          relatedLocations: [
            {
              filePath: "src/app/page.tsx",
              lineStart: 1,
              lineEnd: 1,
            },
          ],
        },
      ],
    },

    currentStepId: "step-1",

    answers: [],

    evaluations: [],

    codeChangeEvaluations: [],

    status: "in_progress",
  };
}

export function getCurrentStep(session: DebuggingSession): DebuggingStep {
  const step = session.lesson.steps.find((item) => item.id === session.currentStepId);

  if (!step) {
    throw new Error(`Current step ${session.currentStepId} was not found.`);
  }

  return step;
}

export function getNextHint(session: DebuggingSession): ProgressiveHint | null {
  const currentStep = getCurrentStep(session);

  let strongestHintUsed = 0;

  for (const evaluation of session.evaluations) {
    if (evaluation.hintGiven && evaluation.hintGiven.level > strongestHintUsed) {
      strongestHintUsed = evaluation.hintGiven.level;
    }
  }

  const nextHintLevel = Math.min(strongestHintUsed + 1, 3) as 1 | 2 | 3;

  return currentStep.hints.find((hint) => hint.level === nextHintLevel) ?? null;
}

export function evaluateStepAnswer(
  session: DebuggingSession,
  answerText: string,
  submittedAt: string = new Date().toISOString(),
): {
  answer: UserAnswer;
  evaluation: StepEvaluation;
} {
  const currentStep = getCurrentStep(session);

  const answer: UserAnswer = {
    stepId: currentStep.id,
    answerText,
    submittedAt,
  };

  const normalized = normalize(answerText);

  if (normalized.length < 3) {
    return {
      answer,
      evaluation: {
        status: "unclear",
        whatWasRight: "You submitted a response, but there is not enough detail to evaluate yet.",
        missingConcepts: currentStep.conceptsRequired,
        misconception: null,
        nextResponse: "Can you explain your thinking in a little more detail?",
        advanceToNextStep: false,
      },
    };
  }

  if (isClarificationRequest(normalized)) {
    return {
      answer,
      evaluation: {
        status: "clarification_requested",
        whatWasRight: "You recognized that the question needs clarification before guessing.",
        missingConcepts: [],
        misconception: null,
        nextResponse:
          "This step is asking you to reason about how the import path maps to the file structure. Try to explain where the import starts and what folder it points to.",
        advanceToNextStep: false,
      },
    };
  }

  if (currentStep.id === "step-1") {
    return {
      answer,
      evaluation: evaluateStepOne(normalized, session),
    };
  }

  if (currentStep.id === "step-2") {
    return {
      answer,
      evaluation: evaluateStepTwo(normalized, session),
    };
  }

  return {
    answer,
    evaluation: evaluateStepThree(normalized, session),
  };
}

export function recordStepAnswer(
  session: DebuggingSession,
  answerText: string,
  submittedAt: string = new Date().toISOString(),
): DebuggingSession {
  const result = evaluateStepAnswer(session, answerText, submittedAt);

  const nextStepId = result.evaluation.advanceToNextStep
    ? getNextStepId(session) ?? session.currentStepId
    : session.currentStepId;

  return {
    ...session,
    currentStepId: nextStepId,
    answers: [...session.answers, result.answer],
    evaluations: [...session.evaluations, result.evaluation],
  };
}

export function evaluateDemoCodeChange(diffText: string): CodeChangeEvaluation {
  const normalized = normalize(diffText);

  const changedLocations = [
    {
      filePath: "src/app/page.tsx",
      lineStart: 1,
      lineEnd: 1,
      symbolName: "StatCard",
    },
  ];

  if (normalized.includes("./components/statcard")) {
    return {
      status: "fixes_root_cause",
      explanation:
        "This change fixes the root cause because page.tsx and the components folder are both inside src/app, so './components/StatCard' correctly points to the existing component.",
      changedLocations,
      newIssuesIntroduced: [],
      stillMissing: [],
      userLikelyUnderstandsFix: true,
      advanceLesson: true,
    };
  }

  if (normalized.includes("../components/statcard")) {
    return {
      status: "introduces_new_issue",
      explanation:
        "This change uses a relative path, but it goes up one folder first. From src/app/page.tsx, '../components/StatCard' would point outside src/app, so it likely misses the actual component.",
      changedLocations,
      newIssuesIntroduced: [
        "The import path may now point to src/components/StatCard instead of src/app/components/StatCard.",
      ],
      stillMissing: ["Use the path that starts from src/app/page.tsx and reaches src/app/components/StatCard.tsx."],
      userLikelyUnderstandsFix: false,
      advanceLesson: false,
    };
  }

  return {
    status: "does_not_fix_root_cause",
    explanation:
      "This change does not clearly fix the root cause. The import still needs to point from src/app/page.tsx to src/app/components/StatCard.tsx.",
    changedLocations,
    newIssuesIntroduced: [],
    stillMissing: ["The import should resolve to the actual StatCard component location."],
    userLikelyUnderstandsFix: false,
    advanceLesson: false,
  };
}

export function createFinalLearningReport(
  session: DebuggingSession,
  sessionResult: FinalLearningReport["sessionResult"] = "self_solved",
): FinalLearningReport {
  let totalHintsUsed = 0;
  let strongestHintUsed: 0 | 1 | 2 | 3 = 0;

  for (const evaluation of session.evaluations) {
    if (evaluation.hintGiven) {
      totalHintsUsed += 1;

      if (evaluation.hintGiven.level > strongestHintUsed) {
        strongestHintUsed = evaluation.hintGiven.level;
      }
    }
  }

  return {
    sessionResult,

    rootCause: session.hiddenDiagnosis.rootCause,

    finalSolution:
      "Change the import in src/app/page.tsx from '@/components/StatCard' to './components/StatCard'.",

    whatYouDidWell: [
      "You worked through the file-location problem step by step instead of guessing immediately.",
      "You connected the import error to module resolution and project structure.",
    ],

    whereYouStruggled:
      totalHintsUsed > 0
        ? [
            "You needed hints to distinguish between path aliases and relative imports.",
            "You needed support tracing the import path against the actual file location.",
          ]
        : [
            "You solved the main reasoning steps without needing hints.",
          ],

    conceptsReinforced: [
      "module resolution",
      "path aliases",
      "relative imports",
      "Next.js project structure",
    ],

    recommendedReview: [
      {
        title: "TypeScript Module Resolution",
        url: "https://www.typescriptlang.org/docs/handbook/modules/reference.html",
        reason: "Review how TypeScript resolves relative and non-relative imports.",
      },
      {
        title: "Next.js Project Structure",
        url: "https://nextjs.org/docs/app/getting-started/project-structure",
        reason: "Review how folders are commonly organized in the Next.js app directory.",
      },
    ],

    hintSummary: {
      totalHintsUsed,
      strongestHintUsed,
      conceptsThatNeededHints: totalHintsUsed > 0 ? ["path aliases", "relative imports"] : [],
    },
  };
}

export function completeDemoSession(
  session: DebuggingSession,
  sessionResult: FinalLearningReport["sessionResult"] = "self_solved",
): DebuggingSession {
  return {
    ...session,
    endedAt: new Date().toISOString(),
    status: sessionResult,
    finalReport: createFinalLearningReport(session, sessionResult),
  };
}

function evaluateStepOne(normalized: string, session: DebuggingSession): StepEvaluation {
  if (
    hasAny(normalized, ["alias", "path alias", "@"]) &&
    !hasAny(normalized, ["relative", "./", "../"])
  ) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly identified that '@/components/StatCard' is using a path alias rather than a relative path.",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Good. Since this is an alias import, the next step is to compare where the alias points with where the file actually exists.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["relative", "./", "../"])) {
    const hint = getNextHint(session);

    const baseEvaluation: StepEvaluation = {
      status: "partial",
      whatWasRight:
        "You are correctly thinking about import paths, which is the right area of the problem.",
      missingConcepts: ["path aliases"],
      misconception:
        "This specific import does not start with ./ or ../, so it is not a relative import.",
      nextResponse:
        "Look again at the first character of '@/components/StatCard'. What does the @ usually represent in a TypeScript or Next.js project?",
      advanceToNextStep: false,
    };

    return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are focusing on the import statement, which is the right place to look.",
    missingConcepts: ["relative imports", "path aliases"],
    misconception:
      "The key distinction is whether the import starts with ./ or ../, or whether it uses a configured alias like @.",
    nextResponse:
      "Try again: is '@/components/StatCard' relative, or is it using an alias?",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function evaluateStepTwo(normalized: string, session: DebuggingSession): StepEvaluation {
  if (
    hasAny(normalized, ["src/components", "src\\components"]) ||
    hasAny(normalized, ["components/statcard", "components\\statcard"])
  ) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly traced the alias import to a components folder under src.",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Now compare that to the actual file location: src/app/components/StatCard.tsx. The last step is choosing the import path that reaches that file.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["src/app/components", "app/components"])) {
    const hint = getNextHint(session);

    const baseEvaluation: StepEvaluation = {
      status: "partial",
      whatWasRight:
        "You correctly identified the actual location of the component.",
      missingConcepts: ["path alias resolution"],
      misconception:
        "The question is asking where the current alias import appears to point, not where the file actually is.",
      nextResponse:
        "Assume @ points to src. Under that assumption, where does '@/components/StatCard' point?",
      advanceToNextStep: false,
    };

    return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are trying to connect the import path to the file structure, which is the right strategy.",
    missingConcepts: ["path alias resolution"],
    misconception:
      "The @ alias usually maps to a base folder like src, so the rest of the path is appended after that.",
    nextResponse:
      "Try tracing '@/components/StatCard' as if @ means src.",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function evaluateStepThree(normalized: string, session: DebuggingSession): StepEvaluation {
  if (hasAny(normalized, ["./components/statcard", ".\\components\\statcard"])) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly chose './components/StatCard' because the components folder is next to page.tsx inside src/app.",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Correct. That import path reaches the actual StatCard file from src/app/page.tsx.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["../components/statcard", "..\\components\\statcard"])) {
    const hint = getNextHint(session);

    const baseEvaluation: StepEvaluation = {
      status: "partial",
      whatWasRight:
        "You correctly switched from an alias import to a relative import.",
      missingConcepts: ["relative path traversal"],
      misconception:
        "../ goes up one directory first, but the components folder is directly beside page.tsx.",
      nextResponse:
        "From src/app/page.tsx, do you need to go up a folder, or can you enter components directly?",
      advanceToNextStep: false,
    };

    return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are trying to choose the import path, which is the correct final task.",
    missingConcepts: ["relative imports"],
    misconception:
      "The path should be written from the location of page.tsx to the location of StatCard.tsx.",
    nextResponse:
      "Try starting from src/app/page.tsx. The components folder is inside that same src/app folder.",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function getNextStepId(session: DebuggingSession): string | null {
  const currentIndex = session.lesson.steps.findIndex((step) => step.id === session.currentStepId);

  if (currentIndex === -1) {
    return null;
  }

  const nextStep = session.lesson.steps[currentIndex + 1];

  return nextStep?.id ?? null;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function hasAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function isClarificationRequest(value: string): boolean {
  return hasAny(value, [
    "what do you mean",
    "i don't understand",
    "i dont understand",
    "can you explain",
    "clarify",
    "confused",
  ]);
}
