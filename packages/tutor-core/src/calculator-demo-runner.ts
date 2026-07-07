import {
  completeCalculatorDemoSession,
  createDemoCalculatorLogicSession,
  evaluateCalculatorCodeChange,
  getCurrentCalculatorStep,
  recordCalculatorStepAnswer,
} from "./calculator-demo.js";

let session = createDemoCalculatorLogicSession();

console.log("\n==============================");
console.log("AI Debugging Tutor Calculator Demo");
console.log("==============================\n");

console.log("Problem:");
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
console.log(getCurrentCalculatorStep(session).question);

session = recordCalculatorStepAnswer(
  session,
  "They are numbers because 2 and 3 are numbers.",
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

session = recordCalculatorStepAnswer(
  session,
  "They are strings because they are inside quotes.",
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
console.log(getCurrentCalculatorStep(session).question);

session = recordCalculatorStepAnswer(
  session,
  "The plus operator concatenates strings, so it joins them into 23.",
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
console.log(getCurrentCalculatorStep(session).question);

session = recordCalculatorStepAnswer(
  session,
  "Use Number(a) + Number(b) so the values are numbers before addition.",
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

const codeChangeEvaluation = evaluateCalculatorCodeChange(`
-   return a + b;
+   return Number(a) + Number(b);
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

const completedSession = completeCalculatorDemoSession(session, "self_solved");

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

console.log("\nCalculator demo complete.\n");