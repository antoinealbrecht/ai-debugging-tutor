import {
  completeDemoSession,
  createDemoImportErrorSession,
  evaluateDemoCodeChange,
  getCurrentStep,
  recordStepAnswer,
} from "./index.js";

let session = createDemoImportErrorSession();

console.log("\n==============================");
console.log("AI Debugging Tutor Demo");
console.log("==============================\n");

console.log("Error:");
console.log(session.parsedError.rawMessage);

console.log("\nRead First:");
for (const resource of session.lesson.resources) {
  console.log(`- ${resource.title}`);
  console.log(`  Why: ${resource.reason}`);
  console.log(`  Focus: ${resource.focus}`);
}

console.log("\nLesson Objective:");
console.log(session.lesson.objective);

console.log("\n------------------------------");
console.log("Step 1");
console.log("------------------------------");
console.log(getCurrentStep(session).question);

session = recordStepAnswer(
  session,
  "It is a relative import because it points to components.",
);

let latestEvaluation = session.evaluations.at(-1);

console.log("\nUser Answer:");
console.log(session.answers.at(-1)?.answerText);

console.log("\nTutor Feedback:");
console.log(latestEvaluation?.status);
console.log(latestEvaluation?.whatWasRight);
console.log(latestEvaluation?.misconception);
console.log(latestEvaluation?.nextResponse);

if (latestEvaluation?.hintGiven) {
  console.log("\nHint:");
  console.log(`${latestEvaluation.hintGiven.label}: ${latestEvaluation.hintGiven.text}`);
}

session = recordStepAnswer(
  session,
  "It is a path alias import because it starts with @ instead of ./ or ../.",
);

latestEvaluation = session.evaluations.at(-1);

console.log("\nUser Answer:");
console.log(session.answers.at(-1)?.answerText);

console.log("\nTutor Feedback:");
console.log(latestEvaluation?.status);
console.log(latestEvaluation?.whatWasRight);
console.log(latestEvaluation?.nextResponse);

console.log("\n------------------------------");
console.log("Step 2");
console.log("------------------------------");
console.log(getCurrentStep(session).question);

session = recordStepAnswer(
  session,
  "If @ points to src, then it is trying to reach src/components/StatCard.",
);

latestEvaluation = session.evaluations.at(-1);

console.log("\nUser Answer:");
console.log(session.answers.at(-1)?.answerText);

console.log("\nTutor Feedback:");
console.log(latestEvaluation?.status);
console.log(latestEvaluation?.whatWasRight);
console.log(latestEvaluation?.nextResponse);

console.log("\n------------------------------");
console.log("Step 3");
console.log("------------------------------");
console.log(getCurrentStep(session).question);

session = recordStepAnswer(
  session,
  "The correct import should be ./components/StatCard.",
);

latestEvaluation = session.evaluations.at(-1);

console.log("\nUser Answer:");
console.log(session.answers.at(-1)?.answerText);

console.log("\nTutor Feedback:");
console.log(latestEvaluation?.status);
console.log(latestEvaluation?.whatWasRight);
console.log(latestEvaluation?.nextResponse);

console.log("\n------------------------------");
console.log("Check My Change");
console.log("------------------------------");

const codeChangeEvaluation = evaluateDemoCodeChange(`
- import { StatCard } from '@/components/StatCard';
+ import { StatCard } from './components/StatCard';
`);

console.log(codeChangeEvaluation.status);
console.log(codeChangeEvaluation.explanation);

session = {
  ...session,
  codeChangeEvaluations: [
    ...session.codeChangeEvaluations,
    codeChangeEvaluation,
  ],
};

const completedSession = completeDemoSession(session, "self_solved");

console.log("\n------------------------------");
console.log("Final Learning Report");
console.log("------------------------------");

console.log("\nRoot Cause:");
console.log(completedSession.finalReport?.rootCause);

console.log("\nFinal Solution:");
console.log(completedSession.finalReport?.finalSolution);

console.log("\nWhat You Did Well:");
for (const item of completedSession.finalReport?.whatYouDidWell ?? []) {
  console.log(`- ${item}`);
}

console.log("\nWhere You Struggled:");
for (const item of completedSession.finalReport?.whereYouStruggled ?? []) {
  console.log(`- ${item}`);
}

console.log("\nConcepts Reinforced:");
for (const item of completedSession.finalReport?.conceptsReinforced ?? []) {
  console.log(`- ${item}`);
}

console.log("\nRecommended Review:");
for (const item of completedSession.finalReport?.recommendedReview ?? []) {
  console.log(`- ${item.title}: ${item.reason}`);
}

console.log("\nDemo complete.\n");
