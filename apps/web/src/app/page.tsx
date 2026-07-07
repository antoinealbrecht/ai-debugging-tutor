"use client";

import { useState } from "react";

import type {
  CodeChangeEvaluation,
  DebuggingSession,
  ProgressiveHint,
  SessionResult
} from "@ai-debugging-tutor/shared";

import {
  completeCalculatorDemoSession,
  completeDemoSession,
  createDemoCalculatorLogicSession,
  createDemoImportErrorSession,
  evaluateCalculatorCodeChange,
  evaluateDemoCodeChange,
  getCurrentCalculatorStep,
  getCurrentStep,
  recordCalculatorStepAnswer,
  recordStepAnswer
} from "@ai-debugging-tutor/tutor-core";

type DemoKind = "import" | "calculator";

type DemoConfig = {
  title: string;
  label: string;
  description: string;
  category: string;
  primaryFilePath: string;
  primaryCode: string;
  secondaryFilePath?: string;
  secondaryCode?: string;
  defaultDiff: string;
};

const demos: Record<DemoKind, DemoConfig> = {
  import: {
    title: "Import/module-resolution bug",
    label: "Import Error",
    description:
      "A Next.js component import points to the wrong location. The tutor teaches path aliases, relative imports, and file structure.",
    category: "import_module_resolution",
    primaryFilePath: "src/app/page.tsx",
    primaryCode: `import { StatCard } from '@/components/StatCard';

export default function Page() {
  return <StatCard title="Users" value="120" />;
}`,
    secondaryFilePath: "src/app/components/StatCard.tsx",
    secondaryCode: `type StatCardProps = {
  title: string;
  value: string;
};

export function StatCard({ title, value }: StatCardProps) {
  return <div>{title}: {value}</div>;
}`,
    defaultDiff: `- import { StatCard } from '@/components/StatCard';
+ import { StatCard } from './components/StatCard';`
  },
  calculator: {
    title: "Calculator incorrect-output bug",
    label: "Logic Bug",
    description:
      "A calculator function runs without crashing but produces the wrong output. The tutor teaches input types, string concatenation, and number conversion.",
    category: "incorrect_output_logic_error",
    primaryFilePath: "src/calculator.ts",
    primaryCode: `function add(a: string, b: string) {
  return a + b;
}

console.log(add("2", "3"));

// Expected: 5
// Actual: 23`,
    defaultDiff: `-   return a + b;
+   return Number(a) + Number(b);`
  }
};

function createSessionForDemo(kind: DemoKind): DebuggingSession {
  if (kind === "calculator") {
    return createDemoCalculatorLogicSession();
  }

  return createDemoImportErrorSession();
}

function getCurrentStepForDemo(kind: DemoKind, session: DebuggingSession) {
  if (kind === "calculator") {
    return getCurrentCalculatorStep(session);
  }

  return getCurrentStep(session);
}

function recordAnswerForDemo(
  kind: DemoKind,
  session: DebuggingSession,
  answerText: string
): DebuggingSession {
  if (kind === "calculator") {
    return recordCalculatorStepAnswer(session, answerText);
  }

  return recordStepAnswer(session, answerText);
}

function evaluateCodeChangeForDemo(
  kind: DemoKind,
  diffText: string
): CodeChangeEvaluation {
  if (kind === "calculator") {
    return evaluateCalculatorCodeChange(diffText);
  }

  return evaluateDemoCodeChange(diffText);
}

function completeSessionForDemo(
  kind: DemoKind,
  session: DebuggingSession,
  sessionResult: SessionResult
): DebuggingSession {
  if (kind === "calculator") {
    return completeCalculatorDemoSession(session, sessionResult);
  }

  return completeDemoSession(session, sessionResult);
}

export default function Home() {
  const [demoKind, setDemoKind] = useState<DemoKind>("import");
  const [session, setSession] = useState<DebuggingSession>(() =>
    createSessionForDemo("import")
  );

  const [answerText, setAnswerText] = useState("");
  const [diffText, setDiffText] = useState(demos.import.defaultDiff);
  const [manualHint, setManualHint] = useState<ProgressiveHint | null>(null);
  const [manualHintLevel, setManualHintLevel] = useState(0);
  const [codeEvaluation, setCodeEvaluation] =
    useState<CodeChangeEvaluation | null>(null);

  const currentDemo = demos[demoKind];
  const currentStep = getCurrentStepForDemo(demoKind, session);
  const latestEvaluation = session.evaluations.at(-1) ?? null;
  const finalReport = session.finalReport;

  function switchDemo(nextDemoKind: DemoKind) {
    setDemoKind(nextDemoKind);
    setSession(createSessionForDemo(nextDemoKind));
    setAnswerText("");
    setDiffText(demos[nextDemoKind].defaultDiff);
    setManualHint(null);
    setManualHintLevel(0);
    setCodeEvaluation(null);
  }

  function handleSubmitAnswer() {
    if (!answerText.trim()) {
      return;
    }

    const previousStepId = session.currentStepId;
    const nextSession = recordAnswerForDemo(demoKind, session, answerText);

    setSession(nextSession);
    setAnswerText("");

    if (nextSession.currentStepId !== previousStepId) {
      setManualHint(null);
      setManualHintLevel(0);
    }
  }

  function handleGetHint() {
    const nextLevel = Math.min(manualHintLevel + 1, 3) as 1 | 2 | 3;
    const hint = currentStep.hints.find((item) => item.level === nextLevel);

    if (!hint) {
      return;
    }

    setManualHint(hint);
    setManualHintLevel(nextLevel);
  }

  function handleCheckChange() {
    const evaluation = evaluateCodeChangeForDemo(demoKind, diffText);

    const updatedSession: DebuggingSession = {
      ...session,
      codeChangeEvaluations: [...session.codeChangeEvaluations, evaluation]
    };

    setCodeEvaluation(evaluation);

    if (evaluation.status === "fixes_root_cause") {
      setSession(completeSessionForDemo(demoKind, updatedSession, "self_solved"));
      return;
    }

    setSession(updatedSession);
  }

  function handleRevealSolution() {
    const confirmed = window.confirm(
      "Reveal the solution and mark this session as solution_revealed?"
    );

    if (!confirmed) {
      return;
    }

    setSession(completeSessionForDemo(demoKind, session, "solution_revealed"));
  }

  function handleRestart() {
    switchDemo(demoKind);
  }

  return (
    <main className="page">
      <section className="editorPanel">
        <div className="panelHeader">
          <p className="eyebrow">Demo Repository</p>
          <h1>AI Debugging Tutor</h1>
          <p className="subtle">
            This prototype shows the core tutoring loop before we connect it to
            the VS Code extension.
          </p>
        </div>

        <div className="demoSwitcher">
          <button
            className={demoKind === "import" ? "activeDemoButton" : "secondaryButton"}
            onClick={() => switchDemo("import")}
          >
            Import bug
          </button>
          <button
            className={
              demoKind === "calculator" ? "activeDemoButton" : "secondaryButton"
            }
            onClick={() => switchDemo("calculator")}
          >
            Calculator logic bug
          </button>
        </div>

        <div className="panelHeader">
          <p className="eyebrow">Selected Demo</p>
          <h2>{currentDemo.title}</h2>
          <p className="subtle">{currentDemo.description}</p>
          <p className="meta">
            Category: <strong>{currentDemo.category}</strong>
          </p>
        </div>

        <div className="codeCard">
          <div className="codeHeader">
            <span>{currentDemo.primaryFilePath}</span>
            <span className="errorBadge">{currentDemo.label}</span>
          </div>

          <pre>{currentDemo.primaryCode}</pre>
        </div>

        <div className="terminalCard">
          <p className="terminalTitle">Problem</p>
          <code>{session.parsedError.rawMessage}</code>
        </div>

        {currentDemo.secondaryFilePath && currentDemo.secondaryCode ? (
          <div className="codeCard">
            <div className="codeHeader">
              <span>{currentDemo.secondaryFilePath}</span>
              <span className="successBadge">Relevant File</span>
            </div>

            <pre>{currentDemo.secondaryCode}</pre>
          </div>
        ) : null}
      </section>

      <aside className="tutorPanel">
        <div className="tutorHeader">
          <p className="eyebrow">Tutor Sidebar</p>
          <h2>Debug with Tutor</h2>
          <p className="subtle">
            Status: <strong>{session.status}</strong>
          </p>
        </div>

        <section className="card">
          <h3>Error Summary</h3>
          <p>{session.parsedError.rawMessage}</p>
          <p className="meta">
            {session.parsedError.filePath}
            {session.parsedError.line ? `:${session.parsedError.line}` : ""}
          </p>
        </section>

        <section className="card">
          <h3>Read First</h3>

          <div className="resourceList">
            {session.lesson.resources.map((resource) => (
              <article className="resource" key={resource.title}>
                <a href={resource.url} target="_blank">
                  {resource.title}
                </a>
                <p>
                  <strong>Why:</strong> {resource.reason}
                </p>
                <p>
                  <strong>Focus:</strong> {resource.focus}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Debugging Lesson</h3>
          <p className="meta">{session.lesson.objective}</p>

          <div className="progressList">
            {session.lesson.steps.map((step) => (
              <span
                className={
                  step.id === session.currentStepId
                    ? "progressPill activeProgressPill"
                    : "progressPill"
                }
                key={step.id}
              >
                {step.id.replace("step-", "Step ")}
              </span>
            ))}
          </div>

          <div className="stepBox">
            <p className="stepCount">
              {currentStep.id.replace("step-", "Step ")} of{" "}
              {session.lesson.steps.length}
            </p>
            <h4>{currentStep.objective}</h4>
            <p>{currentStep.question}</p>
          </div>

          <textarea
            className="answerBox"
            placeholder="Type your reasoning here..."
            value={answerText}
            onChange={(event) => setAnswerText(event.target.value)}
          />

          <div className="buttonRow">
            <button onClick={handleSubmitAnswer}>Submit Answer</button>
            <button className="secondaryButton" onClick={handleGetHint}>
              Hint
            </button>
          </div>

          {manualHint ? (
            <div className="hintBox">
              <p>
                <strong>{manualHint.label}:</strong> {manualHint.text}
              </p>
            </div>
          ) : null}
        </section>

        {latestEvaluation ? (
          <section className="card">
            <h3>Feedback</h3>
            <p>
              <strong>Status:</strong> {latestEvaluation.status}
            </p>
            <p>
              <strong>What was right:</strong> {latestEvaluation.whatWasRight}
            </p>

            {latestEvaluation.misconception ? (
              <p>
                <strong>What to rethink:</strong>{" "}
                {latestEvaluation.misconception}
              </p>
            ) : null}

            <p>
              <strong>Next:</strong> {latestEvaluation.nextResponse}
            </p>

            {latestEvaluation.hintGiven ? (
              <div className="hintBox">
                <p>
                  <strong>{latestEvaluation.hintGiven.label}:</strong>{" "}
                  {latestEvaluation.hintGiven.text}
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="card">
          <h3>Check My Change</h3>
          <textarea
            className="diffBox"
            value={diffText}
            onChange={(event) => setDiffText(event.target.value)}
          />

          <button onClick={handleCheckChange}>Check My Change</button>

          {codeEvaluation ? (
            <div className="feedbackBox">
              <p>
                <strong>Status:</strong> {codeEvaluation.status}
              </p>
              <p>{codeEvaluation.explanation}</p>
            </div>
          ) : null}
        </section>

        <section className="card">
          <h3>Actions</h3>
          <div className="buttonRow">
            <button className="dangerButton" onClick={handleRevealSolution}>
              Reveal Solution
            </button>
            <button className="secondaryButton" onClick={handleRestart}>
              Restart Demo
            </button>
          </div>
        </section>

        {finalReport ? (
          <section className="card finalReport">
            <h3>Final Learning Report</h3>

            <h4>Root Cause</h4>
            <p>{finalReport.rootCause}</p>

            <h4>Final Solution</h4>
            <p>{finalReport.finalSolution}</p>

            <h4>What You Did Well</h4>
            <ul>
              {finalReport.whatYouDidWell.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h4>Where You Struggled</h4>
            <ul>
              {finalReport.whereYouStruggled.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h4>Concepts Reinforced</h4>
            <ul>
              {finalReport.conceptsReinforced.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
    </main>
  );
}