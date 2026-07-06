# AI Debugging Tutor — Product Specification

## Core Principle

AI Debugging Tutor helps developers solve bugs themselves instead of outsourcing the thinking.

## Required V1 Features

1. The tutor provides targeted resources before the user solves the problem.
2. The tutor breaks the debugging process into several smaller steps.
3. The user answers each step, and the tutor evaluates the answer.
4. If the answer is correct, the tutor explains what the user did right and moves forward.
5. If the answer is incorrect, the tutor explains what was right, what was wrong, and gives a hint.
6. After the bug is solved, the tutor produces a learning summary explaining:
   - the root cause
   - the final solution
   - what the user did well
   - what the user struggled with
   - what concepts were reinforced

## Primary V1 Interface

The primary interface is a VS Code extension sidebar.

A web version may exist as a prototype and demo, but the finished V1 experience should happen inside VS Code.

## Supported V1 Languages and Frameworks

- JavaScript
- TypeScript
- React
- Next.js
- Node.js

## Supported V1 Error Categories

- Import and module-resolution errors
- TypeScript type errors
- Nullability errors
- Incorrect function signatures
- React hook mistakes
- Server/client component problems
- Async logic errors
- Prisma schema/client mismatches
- State-update errors
- Configuration errors

## Out of Scope for V1

- Autonomous code edits
- Running arbitrary user code
- Languages beyond JavaScript and TypeScript
- Pull request automation
- Team dashboards
- Classroom tools
- Voice tutoring