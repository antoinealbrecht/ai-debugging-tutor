import { describe, expect, it } from "vitest";

import {
  completeDemoSession,
  createDemoImportErrorSession,
  evaluateDemoCodeChange,
  evaluateStepAnswer,
  getCurrentStep,
  recordStepAnswer,
} from "./index.js";

describe("demo import error tutor session", () => {
  it("creates a session with resources before solving", () => {
    const session = createDemoImportErrorSession();

    expect(session.status).toBe("in_progress");
    expect(session.lesson.resources.length).toBeGreaterThanOrEqual(2);

    expect(session.lesson.resources[0]?.title).toBe("TypeScript Module Resolution");
    expect(session.lesson.resources[0]?.reason).toContain("resolves import paths");
    expect(session.lesson.resources[0]?.focus).toContain("relative imports");
  });

  it("starts on step 1", () => {
    const session = createDemoImportErrorSession();
    const currentStep = getCurrentStep(session);

    expect(currentStep.id).toBe("step-1");
    expect(currentStep.question).toContain("relative import or a path-alias import");
  });

  it("marks a wrong step 1 answer as partial and gives a hint", () => {
    const session = createDemoImportErrorSession();

    const result = evaluateStepAnswer(
      session,
      "It is a relative import because it points to components.",
    );

    expect(result.evaluation.status).toBe("partial");
    expect(result.evaluation.advanceToNextStep).toBe(false);
    expect(result.evaluation.hintGiven?.level).toBe(1);
    expect(result.evaluation.misconception).toContain("not a relative import");
  });

  it("accepts a correct path-alias answer even when it mentions relative imports", () => {
    const session = createDemoImportErrorSession();

    const result = evaluateStepAnswer(
      session,
      "It is a path alias import because it starts with @ instead of ./ or ../.",
    );

    expect(result.evaluation.status).toBe("correct");
    expect(result.evaluation.advanceToNextStep).toBe(true);
    expect(result.evaluation.whatWasRight).toContain("path alias");
  });

  it("advances from step 1 to step 2 after a correct answer", () => {
    let session = createDemoImportErrorSession();

    session = recordStepAnswer(
      session,
      "It is a path alias import because it starts with @ instead of ./ or ../.",
    );

    expect(session.currentStepId).toBe("step-2");
  });

  it("advances from step 2 to step 3 after tracing the alias path correctly", () => {
    let session = createDemoImportErrorSession();

    session = recordStepAnswer(
      session,
      "It is a path alias import because it starts with @ instead of ./ or ../.",
    );

    session = recordStepAnswer(
      session,
      "If @ points to src, then it is trying to reach src/components/StatCard.",
    );

    expect(session.currentStepId).toBe("step-3");
    expect(session.evaluations.at(-1)?.status).toBe("correct");
  });

  it("accepts the correct final relative import path", () => {
    let session = createDemoImportErrorSession();

    session = recordStepAnswer(
      session,
      "It is a path alias import because it starts with @ instead of ./ or ../.",
    );

    session = recordStepAnswer(
      session,
      "If @ points to src, then it is trying to reach src/components/StatCard.",
    );

    const result = evaluateStepAnswer(
      session,
      "The correct import should be ./components/StatCard.",
    );

    expect(result.evaluation.status).toBe("correct");
    expect(result.evaluation.advanceToNextStep).toBe(true);
  });

  it("recognizes the correct code change", () => {
    const evaluation = evaluateDemoCodeChange(`
- import { StatCard } from '@/components/StatCard';
+ import { StatCard } from './components/StatCard';
`);

    expect(evaluation.status).toBe("fixes_root_cause");
    expect(evaluation.userLikelyUnderstandsFix).toBe(true);
    expect(evaluation.advanceLesson).toBe(true);
  });

  it("rejects a relative import that goes up too far", () => {
    const evaluation = evaluateDemoCodeChange(`
- import { StatCard } from '@/components/StatCard';
+ import { StatCard } from '../components/StatCard';
`);

    expect(evaluation.status).toBe("introduces_new_issue");
    expect(evaluation.userLikelyUnderstandsFix).toBe(false);
    expect(evaluation.advanceLesson).toBe(false);
  });

  it("creates a final learning report after completion", () => {
    let session = createDemoImportErrorSession();

    session = recordStepAnswer(
      session,
      "It is a relative import because it points to components.",
    );

    session = recordStepAnswer(
      session,
      "It is a path alias import because it starts with @ instead of ./ or ../.",
    );

    const completedSession = completeDemoSession(session, "self_solved");

    expect(completedSession.status).toBe("self_solved");
    expect(completedSession.finalReport?.rootCause).toContain("StatCard");
    expect(completedSession.finalReport?.whatYouDidWell.length).toBeGreaterThan(0);
    expect(completedSession.finalReport?.whereYouStruggled.length).toBeGreaterThan(0);
    expect(completedSession.finalReport?.conceptsReinforced).toContain("path aliases");
    expect(completedSession.finalReport?.hintSummary.totalHintsUsed).toBe(1);
  });
});
