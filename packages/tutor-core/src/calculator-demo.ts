import type {
  CodeChangeEvaluation,
  DebuggingSession,
  DebuggingStep,
  FinalLearningReport,
  ProgressiveHint,
  StepEvaluation,
  UserAnswer,
} from "@ai-debugging-tutor/shared";

export function createDemoCalculatorLogicSession(
  startedAt: string = new Date().toISOString(),
): DebuggingSession {
  return {
    id: "demo-calculator-logic-001",

    startedAt,

    parsedError: {
      rawMessage: "Expected calculator output 5, but received 23.",
      category: "incorrect_output_logic_error",
      source: "manual_input",
      filePath: "src/calculator.ts",
      line: 2,
      frameworkClues: ["JavaScript", "TypeScript"],
    },

    repositoryContext: {
      rootPath: "demo-calculator-app",

      relevantFiles: [
        {
          filePath: "src/calculator.ts",
          language: "typescript",
          contentSnippet: [
            "function add(a: string, b: string) {",
            "  return a + b;",
            "}",
            "",
            "console.log(add(\"2\", \"3\"));",
            "",
            "// Expected: 5",
            "// Actual: 23",
          ].join("\n"),
          lineStart: 1,
          lineEnd: 8,
          reasonIncluded:
            "This file contains the calculator function and the expected versus actual output.",
        },
      ],

      imports: [],

      symbols: [
        {
          name: "add",
          kind: "function",
          definedIn: {
            filePath: "src/calculator.ts",
            lineStart: 1,
            lineEnd: 3,
            symbolName: "add",
          },
          exported: false,
        },
      ],

      configFiles: [],

      retrievalReasoning: [
        {
          type: "exact_file_path",
          description:
            "The incorrect output was reported from src/calculator.ts.",
          confidence: "high",
        },
        {
          type: "symbol_match",
          description:
            "The expected and actual output involve the add function.",
          confidence: "high",
        },
        {
          type: "neighboring_code",
          description:
            "The function call add(\"2\", \"3\") is needed to understand why the output is 23.",
          confidence: "high",
        },
      ],
    },

    hiddenDiagnosis: {
      rootCause:
        "The add function receives string inputs, so the + operator performs string concatenation instead of numeric addition.",

      confidence: "high",

      relevantLocations: [
        {
          filePath: "src/calculator.ts",
          lineStart: 1,
          lineEnd: 2,
          symbolName: "add",
        },
        {
          filePath: "src/calculator.ts",
          lineStart: 5,
          lineEnd: 5,
          symbolName: "add",
        },
      ],

      alternativeCauses: [
        "The function may need number parameters instead of string parameters.",
        "The inputs may need to be converted before addition.",
        "The expected output may not match the current input types.",
      ],

      expectedFix:
        "Convert the string inputs to numbers before adding them, or change the function and call site so the function receives numbers.",

      conceptsRequired: [
        "primitive types",
        "string concatenation",
        "number conversion",
        "operator behavior",
      ],

      errorCategory: "incorrect_output_logic_error",
    },

    lesson: {
      objective:
        "Fix the calculator output by tracing the input types and understanding how JavaScript's + operator behaves.",

      estimatedDifficulty: "beginner",

      resources: [
        {
          title: "MDN: Addition operator",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition",
          source: "MDN",
          reason:
            "This explains why + can perform either numeric addition or string concatenation.",
          focus:
            "Focus on what happens when one or both operands are strings.",
          relatedConcepts: [
            "addition operator",
            "string concatenation",
            "type coercion",
          ],
        },
        {
          title: "MDN: Number()",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number",
          source: "MDN",
          reason:
            "This explains one common way to convert string values into numbers.",
          focus:
            "Focus on converting numeric-looking strings like \"2\" into the number 2.",
          relatedConcepts: ["number conversion", "primitive types"],
        },
      ],

      steps: [
        {
          id: "step-1",
          objective: "Identify the input types.",
          question:
            "When add(\"2\", \"3\") is called, what are the types of the two arguments? How can you tell?",
          conceptsRequired: ["primitive types", "string literals"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "Look closely at how the values are written in the function call.",
            },
            {
              level: 2,
              label: "Focus",
              text: "Values inside quotation marks are treated differently from bare numbers.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "\"2\" and \"3\" are strings, not numbers, because they are wrapped in quotes.",
            },
          ],
          completionCriteria: [
            "User understands that \"2\" and \"3\" are strings.",
          ],
          relatedLocations: [
            {
              filePath: "src/calculator.ts",
              lineStart: 5,
              lineEnd: 5,
            },
          ],
        },
        {
          id: "step-2",
          objective: "Understand the + operator behavior.",
          question:
            "What does the + operator do when both operands are strings?",
          conceptsRequired: ["addition operator", "string concatenation"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "The + operator does not always mean numeric addition in JavaScript.",
            },
            {
              level: 2,
              label: "Focus",
              text: "Try thinking about what happens when you combine two pieces of text.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "With strings, + joins them together, so \"2\" + \"3\" becomes \"23\".",
            },
          ],
          completionCriteria: [
            "User understands that + concatenates strings.",
          ],
          relatedLocations: [
            {
              filePath: "src/calculator.ts",
              lineStart: 2,
              lineEnd: 2,
            },
          ],
        },
        {
          id: "step-3",
          objective: "Choose a fix that performs numeric addition.",
          question:
            "What change would make this function return the number 5 instead of the string-like result 23?",
          conceptsRequired: ["number conversion", "function input types"],
          hints: [
            {
              level: 1,
              label: "Direction",
              text: "The values need to be numbers before they are added.",
            },
            {
              level: 2,
              label: "Focus",
              text: "You can either pass numbers into the function or convert the string inputs inside the function.",
            },
            {
              level: 3,
              label: "Strong clue",
              text: "One valid fix is Number(a) + Number(b). Another is changing the function to accept numbers and calling add(2, 3).",
            },
          ],
          completionCriteria: [
            "User chooses a fix that ensures numeric addition instead of string concatenation.",
          ],
          relatedLocations: [
            {
              filePath: "src/calculator.ts",
              lineStart: 1,
              lineEnd: 5,
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

export function getCurrentCalculatorStep(
  session: DebuggingSession,
): DebuggingStep {
  const step = session.lesson.steps.find(
    (item) => item.id === session.currentStepId,
  );

  if (!step) {
    throw new Error(`Current step ${session.currentStepId} was not found.`);
  }

  return step;
}

export function evaluateCalculatorStepAnswer(
  session: DebuggingSession,
  answerText: string,
  submittedAt: string = new Date().toISOString(),
): {
  answer: UserAnswer;
  evaluation: StepEvaluation;
} {
  const currentStep = getCurrentCalculatorStep(session);

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
        whatWasRight:
          "You submitted a response, but there is not enough detail to evaluate yet.",
        missingConcepts: currentStep.conceptsRequired,
        misconception: null,
        nextResponse: "Can you explain your reasoning in a little more detail?",
        advanceToNextStep: false,
      },
    };
  }

  if (currentStep.id === "step-1") {
    return {
      answer,
      evaluation: evaluateCalculatorStepOne(normalized, session),
    };
  }

  if (currentStep.id === "step-2") {
    return {
      answer,
      evaluation: evaluateCalculatorStepTwo(normalized, session),
    };
  }

  return {
    answer,
    evaluation: evaluateCalculatorStepThree(normalized, session),
  };
}

export function recordCalculatorStepAnswer(
  session: DebuggingSession,
  answerText: string,
  submittedAt: string = new Date().toISOString(),
): DebuggingSession {
  const result = evaluateCalculatorStepAnswer(session, answerText, submittedAt);

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

export function evaluateCalculatorCodeChange(
  diffText: string,
): CodeChangeEvaluation {
  const normalized = normalize(diffText);

  const changedLocations = [
    {
      filePath: "src/calculator.ts",
      lineStart: 1,
      lineEnd: 5,
      symbolName: "add",
    },
  ];

  if (
    hasAny(normalized, ["number(a) + number(b)", "number(a)+number(b)"]) ||
    hasAny(normalized, ["parseint(a", "parsefloat(a", "+a + +b"])
  ) {
    return {
      status: "fixes_root_cause",
      explanation:
        "This change fixes the root cause because the values are converted to numbers before the + operator runs, so JavaScript performs numeric addition instead of string concatenation.",
      changedLocations,
      newIssuesIntroduced: [],
      stillMissing: [],
      userLikelyUnderstandsFix: true,
      advanceLesson: true,
    };
  }

  if (
    hasAny(normalized, ["a: number", "b: number"]) &&
    hasAny(normalized, ["add(2, 3)", "add(2,3)"])
  ) {
    return {
      status: "fixes_root_cause",
      explanation:
        "This change fixes the root cause because the function now receives numbers instead of strings, so + performs numeric addition.",
      changedLocations,
      newIssuesIntroduced: [],
      stillMissing: [],
      userLikelyUnderstandsFix: true,
      advanceLesson: true,
    };
  }

  if (hasAny(normalized, ["return a + b"])) {
    return {
      status: "does_not_fix_root_cause",
      explanation:
        "The function still returns a + b without ensuring the values are numbers. If a and b are strings, the output can still be 23.",
      changedLocations,
      newIssuesIntroduced: [],
      stillMissing: [
        "Convert the inputs to numbers or make sure the function receives numbers.",
      ],
      userLikelyUnderstandsFix: false,
      advanceLesson: false,
    };
  }

  return {
    status: "unclear",
    explanation:
      "This change is not enough to confidently tell whether the calculator now performs numeric addition.",
    changedLocations,
    newIssuesIntroduced: [],
    stillMissing: [
      "Make sure the values are numbers before the + operator runs.",
    ],
    userLikelyUnderstandsFix: false,
    advanceLesson: false,
  };
}

export function completeCalculatorDemoSession(
  session: DebuggingSession,
  sessionResult: FinalLearningReport["sessionResult"] = "self_solved",
): DebuggingSession {
  return {
    ...session,
    endedAt: new Date().toISOString(),
    status: sessionResult,
    finalReport: createCalculatorFinalLearningReport(session, sessionResult),
  };
}

function createCalculatorFinalLearningReport(
  session: DebuggingSession,
  sessionResult: FinalLearningReport["sessionResult"],
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
      "Convert the inputs before adding, such as return Number(a) + Number(b), or change the function to receive numbers and call add(2, 3).",

    whatYouDidWell: [
      "You traced the incorrect output back to the add function instead of only looking at the final console output.",
      "You connected the unexpected result 23 to how JavaScript treats the + operator with strings.",
    ],

    whereYouStruggled:
      totalHintsUsed > 0
        ? [
            "You needed hints to notice that quoted numeric values are strings.",
            "You needed support distinguishing string concatenation from numeric addition.",
          ]
        : ["You identified the input types and operator behavior without needing hints."],

    conceptsReinforced: [
      "primitive types",
      "string literals",
      "string concatenation",
      "number conversion",
      "operator behavior",
    ],

    recommendedReview: [
      {
        title: "MDN: Addition operator",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition",
        reason:
          "Review when + performs numeric addition versus string concatenation.",
      },
      {
        title: "MDN: Number()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number",
        reason:
          "Review how to convert numeric-looking strings into numbers.",
      },
    ],

    hintSummary: {
      totalHintsUsed,
      strongestHintUsed,
      conceptsThatNeededHints:
        totalHintsUsed > 0
          ? ["string literals", "string concatenation", "number conversion"]
          : [],
    },
  };
}

function evaluateCalculatorStepOne(
  normalized: string,
  session: DebuggingSession,
): StepEvaluation {
  if (
    hasAny(normalized, ["string", "strings", "text"]) ||
    hasAny(normalized, ["quotes", "quotation"])
  ) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly identified that \"2\" and \"3\" are strings because they are wrapped in quotes.",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Good. Now we need to connect those string inputs to the behavior of the + operator.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["number", "numbers", "integer", "integers"])) {
    const hint = getNextHint(session);

    const baseEvaluation: StepEvaluation = {
      status: "partial",
      whatWasRight:
        "You correctly noticed that the values look numeric.",
      missingConcepts: ["string literals"],
      misconception:
        "Even though the values look like numbers, the quotation marks make them strings.",
      nextResponse:
        "Look again at the function call. Are 2 and 3 written as bare numbers or as quoted values?",
      advanceToNextStep: false,
    };

    return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are looking at the function call, which is the right place to start.",
    missingConcepts: ["string literals", "primitive types"],
    misconception:
      "The key detail is how the argument values are written.",
    nextResponse:
      "Try again: what does it mean when 2 and 3 are written inside quotation marks?",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function evaluateCalculatorStepTwo(
  normalized: string,
  session: DebuggingSession,
): StepEvaluation {
  if (
    hasAny(normalized, ["concatenate", "concatenation", "joins", "combine"]) ||
    hasAny(normalized, ["23"])
  ) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly identified that + joins strings together, which is why \"2\" + \"3\" becomes \"23\".",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Now that we know the issue is string concatenation, the final step is choosing a fix that makes the operation numeric.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["add", "addition", "sum", "adds"])) {
    const hint = getNextHint(session);

    const baseEvaluation: StepEvaluation = {
      status: "partial",
      whatWasRight:
        "You are correctly thinking about what the + operator usually means.",
      missingConcepts: ["string concatenation"],
      misconception:
        "With strings, + does not perform numeric addition. It joins the strings together.",
      nextResponse:
        "If the operands are \"2\" and \"3\", what does joining them together produce?",
      advanceToNextStep: false,
    };

    return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are focusing on the operator, which is the right part of the expression.",
    missingConcepts: ["addition operator", "string concatenation"],
    misconception:
      "The + operator changes behavior depending on the operand types.",
    nextResponse:
      "Try again: what does + do when both values are strings?",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function evaluateCalculatorStepThree(
  normalized: string,
  session: DebuggingSession,
): StepEvaluation {
  if (
    hasAny(normalized, ["number(", "parseint", "parsefloat", "convert"]) ||
    hasAny(normalized, ["a: number", "b: number", "add(2, 3)", "add(2,3)"])
  ) {
    return {
      status: "correct",
      whatWasRight:
        "You correctly chose a fix that makes the operands numbers before addition happens.",
      missingConcepts: [],
      misconception: null,
      nextResponse:
        "Correct. That prevents string concatenation and makes the calculator return 5.",
      advanceToNextStep: true,
    };
  }

  if (hasAny(normalized, ["remove quotes", "no quotes"])) {
    return {
      status: "mostly_correct",
      whatWasRight:
        "You correctly recognized that the quotes are what made the inputs strings.",
      missingConcepts: ["function type consistency"],
      misconception: null,
      nextResponse:
        "That can work if you also update the function's parameter types from string to number. What would need to change in the function signature?",
      advanceToNextStep: false,
    };
  }

  const hint = getNextHint(session);

  const baseEvaluation: StepEvaluation = {
    status: "incorrect",
    whatWasRight:
      "You are trying to choose a fix, which is the right final step.",
    missingConcepts: ["number conversion", "operator behavior"],
    misconception:
      "The fix needs to ensure that + receives numbers, not strings.",
    nextResponse:
      "Try again: how could you convert a numeric-looking string into a number before adding?",
    advanceToNextStep: false,
  };

  return hint ? { ...baseEvaluation, hintGiven: hint } : baseEvaluation;
}

function getNextHint(session: DebuggingSession): ProgressiveHint | null {
  const currentStep = getCurrentCalculatorStep(session);

  let strongestHintUsed = 0;

  for (const evaluation of session.evaluations) {
    if (evaluation.hintGiven && evaluation.hintGiven.level > strongestHintUsed) {
      strongestHintUsed = evaluation.hintGiven.level;
    }
  }

  const nextHintLevel = Math.min(strongestHintUsed + 1, 3) as 1 | 2 | 3;

  return currentStep.hints.find((hint) => hint.level === nextHintLevel) ?? null;
}

function getNextStepId(session: DebuggingSession): string | null {
  const currentIndex = session.lesson.steps.findIndex(
    (step) => step.id === session.currentStepId,
  );

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