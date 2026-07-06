# AI Debugging Tutor — User Journey

## Core User Story

A developer encounters an error while coding in VS Code. Instead of asking an AI assistant to directly fix the issue, they open AI Debugging Tutor.

The tutor analyzes the error, gathers relevant code context, provides helpful resources, and guides the developer through the debugging process step by step.

The goal is not only to fix the bug, but to help the developer understand why the bug happened.

---

## Main Flow

### 1. Developer Encounters an Error

The user may encounter an error from:

- VS Code Problems panel
- Terminal output
- TypeScript compiler
- ESLint
- Next.js build output
- React runtime error
- Node.js stack trace
- Prisma error
- npm build output

Example:

```text
Cannot find module '@/components/StatCard'
```

---

### 2. User Starts a Tutoring Session

The user can start the tutor by:

- Selecting an error from the Problems panel
- Highlighting terminal output
- Right-clicking code and choosing "Debug with Tutor"
- Opening the AI Debugging Tutor sidebar manually

The tutor receives:

- The error message
- File path
- Line and column number if available
- Relevant nearby code
- Related imports and exports
- Related configuration files when needed

---

### 3. Tutor Privately Diagnoses the Bug

The tutor creates a hidden diagnosis before teaching.

The diagnosis includes:

- Likely root cause
- Confidence level
- Relevant files and line ranges
- Alternative possible causes
- Expected fix
- Concepts required to understand the bug

This diagnosis is hidden from the user until the end of the lesson or until the user explicitly chooses to reveal the solution.

---

### 4. Tutor Shows Resources First

Before asking the user to solve the bug, the tutor shows targeted resources.

Each resource includes:

- Title
- Documentation link
- Why it matters
- What section or concept to focus on

Example:

```text
TypeScript Module Resolution

Why this matters:
This error is related to how TypeScript resolves import paths.

Focus:
Read how relative imports are resolved from the file doing the importing.
```

Resources should come from authoritative sources such as:

- MDN
- TypeScript documentation
- React documentation
- Next.js documentation
- Node.js documentation
- Prisma documentation
- ESLint documentation

Resources should not be generic. They should be selected because they directly relate to the current bug and the concepts needed to solve it.

---

### 5. Tutor Breaks the Problem Into Steps

The tutor creates a debugging lesson with multiple steps.

A simple bug may have 2 steps.

A more complex bug may have 4–6 steps.

Each step includes:

- Objective
- Question
- Concepts required
- Hints
- Completion criteria

Example:

```text
Step 1 of 3

Objective:
Understand where the import path starts.

Question:
From which folder does TypeScript begin resolving this import?
```

The tutor should guide the user through the reasoning process instead of giving away the full answer immediately.

---

### 6. User Answers the Step

The user types an answer in the sidebar.

The answer may be:

- Fully correct
- Mostly correct
- Partially correct
- Incorrect
- Unclear
- A request for clarification

The tutor evaluates the user’s reasoning, not exact wording.

---

### 7. Tutor Gives Feedback

If the user is correct, the tutor explains what they did right and moves to the next step.

Example:

```text
Correct.

What you did right:
You correctly identified that relative imports start from the file containing the import, not from the project root.

Next:
Now trace the actual path TypeScript is trying to resolve.
```

If the user is incorrect, the tutor explains:

- What part of their thinking was right
- What part was wrong
- What concept they are missing
- A hint to help them try again

Example:

```text
Partially correct.

What you got right:
You correctly noticed that this is an import-path issue.

What to rethink:
The import does not start from the project root. Relative imports start from the file that contains the import.

Hint:
Look at the folder containing the file with the error.
```

The tutor should not simply say "wrong." It should help the user understand how to improve their reasoning.

---

### 8. User Can Request Hints

Hints become gradually stronger.

The tutor should not reveal the solution immediately.

Example:

```text
Hint 1:
Start from the file that contains the import.

Hint 2:
If the file is in src/app, then ./components points to src/app/components.

Hint 3:
Compare that path to where the component actually exists.
```

The final reveal should only happen when the user explicitly gives up or chooses to reveal the solution.

---

### 9. User Changes Code

The user makes their own code change.

The tutor does not edit the code automatically.

The user can click:

```text
Check My Change
```

The tutor evaluates the diff and determines whether:

- The root cause was fixed
- Another issue was introduced
- The user seems to understand why the fix worked
- The session should move forward

The tutor should encourage the user to make the change themselves instead of silently modifying the repository.

---

### 10. User Finishes the Lesson

The lesson ends when:

- The user solves the bug
- The tutor confirms the fix
- All required concepts have been covered

The tutor then generates a final learning summary.

---

## Final Learning Summary

The final summary includes the following sections.

### Root Cause

A clear explanation of why the bug happened.

### Final Solution

The corrected code or change.

### What You Did Well

Specific reasoning the user demonstrated correctly.

### Where You Struggled

Specific misconceptions, missed steps, or areas where the user needed hints.

### Concepts Reinforced

Examples:

- Relative imports
- TypeScript nullability
- Async control flow
- React hooks
- Next.js server/client boundaries
- Prisma schema/client consistency

### Recommended Review

One or two targeted resources or a small follow-up exercise.

---

## Reveal Solution Flow

The user may click:

```text
Reveal Solution
```

The tutor should ask for confirmation before revealing.

If the user confirms, the tutor shows:

- The likely root cause
- The expected fix
- Why that fix works
- What concept the user should review

The session should be marked as:

```text
solution revealed
```

not:

```text
self solved
```

---

## Product Feeling

The tutor should feel like:

- A patient programming tutor
- A debugging coach
- A guided lesson
- A technical mentor

It should not feel like:

- An answer bot
- An autocomplete tool
- A replacement for thinking
- A generic chatbot

---

## Core Product Rule

AI Debugging Tutor should help developers solve bugs themselves instead of outsourcing the thinking.