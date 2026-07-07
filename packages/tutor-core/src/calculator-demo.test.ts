import { describe, expect, it } from "vitest";

import {
  completeCalculatorDemoSession,
  createDemoCalculatorLogicSession,
  evaluateCalculatorCodeChange,
  evaluateCalculatorStepAnswer,
  getCurrentCalculatorStep,
  recordCalculatorStepAnswer,
} from "./calculator-demo.js";

describe("demo calculator incorrect-output tutor session", () => {
  it("creates a calculator logic session with resources before solving", () => {
    const session = createDemoCalculatorLogicSession();

    expect(session.parsedError.category).toBe("incorrect_output_logic_error");
    expect(session.lesson.resources.length).toBeGreaterThanOrEqual(2);
    expect(session.lesson.resources[0]?.title).toBe("MDN: Addition operator");
    expect(session.lesson.resources[0]?.focus).toContain("strings");
  });

  it("starts on step 1", () => {
    const session = createDemoCalculatorLogicSession();
    const currentStep = getCurrentCalculatorStep(session);

    expect(currentStep.id).toBe("step-1");
    expect(currentStep.question).toContain("types");
  });

  it("marks a wrong step 1 answer as partial and gives a hint", () => {
    const session = createDemoCalculatorLogicSession();

    const result = evaluateCalculatorStepAnswer(
      session,
      "They are numbers because 2 and 3 are numbers.",
    );

    expect(result.evaluation.status).toBe("partial");
    expect(result.evaluation.advanceToNextStep).toBe(false);
    expect(result.evaluation.hintGiven?.level).toBe(1);
    expect(result.evaluation.misconception).toContain("quotation marks");
  });

  it("accepts that quoted values are strings", () => {
    const session = createDemoCalculatorLogicSession();

    const result = evaluateCalculatorStepAnswer(
      session,
      "They are strings because they are inside quotes.",
    );

    expect(result.evaluation.status).toBe("correct");
    expect(result.evaluation.advanceToNextStep).toBe(true);
  });

  it("advances from step 1 to step 2 after a correct answer", () => {
    let session = createDemoCalculatorLogicSession();

    session = recordCalculatorStepAnswer(
      session,
      "They are strings because they are inside quotes.",
    );

    expect(session.currentStepId).toBe("step-2");
  });

  it("accepts string concatenation explanation", () => {
    let session = createDemoCalculatorLogicSession();

    session = recordCalculatorStepAnswer(
      session,
      "They are strings because they are inside quotes.",
    );

    const result = evaluateCalculatorStepAnswer(
      session,
      "The plus operator concatenates strings, so it joins them into 23.",
    );

    expect(result.evaluation.status).toBe("correct");
    expect(result.evaluation.advanceToNextStep).toBe(true);
  });

  it("accepts converting inputs to numbers as the final fix", () => {
    let session = createDemoCalculatorLogicSession();

    session = recordCalculatorStepAnswer(
      session,
      "They are strings because they are inside quotes.",
    );

    session = recordCalculatorStepAnswer(
      session,
      "The plus operator concatenates strings, so it joins them into 23.",
    );

    const result = evaluateCalculatorStepAnswer(
      session,
      "Use Number(a) + Number(b) so the values are numbers before addition.",
    );

    expect(result.evaluation.status).toBe("correct");
    expect(result.evaluation.advanceToNextStep).toBe(true);
  });

  it("recognizes Number conversion as a correct code change", () => {
    const evaluation = evaluateCalculatorCodeChange(`
-   return a + b;
+   return Number(a) + Number(b);
`);

    expect(evaluation.status).toBe("fixes_root_cause");
    expect(evaluation.userLikelyUnderstandsFix).toBe(true);
    expect(evaluation.advanceLesson).toBe(true);
  });

  it("rejects leaving return a + b unchanged", () => {
    const evaluation = evaluateCalculatorCodeChange(`
  function add(a: string, b: string) {
    return a + b;
  }
`);

    expect(evaluation.status).toBe("does_not_fix_root_cause");
    expect(evaluation.userLikelyUnderstandsFix).toBe(false);
    expect(evaluation.advanceLesson).toBe(false);
  });

  it("creates a final learning report", () => {
    let session = createDemoCalculatorLogicSession();

    session = recordCalculatorStepAnswer(
      session,
      "They are numbers because 2 and 3 are numbers.",
    );

    session = recordCalculatorStepAnswer(
      session,
      "They are strings because they are inside quotes.",
    );

    const completedSession = completeCalculatorDemoSession(
      session,
      "self_solved",
    );

    expect(completedSession.status).toBe("self_solved");
    expect(completedSession.finalReport?.rootCause).toContain("string inputs");
    expect(completedSession.finalReport?.conceptsReinforced).toContain(
      "string concatenation",
    );
    expect(completedSession.finalReport?.hintSummary.totalHintsUsed).toBe(1);
  });
});