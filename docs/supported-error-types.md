# AI Debugging Tutor — Supported Error Types

## Purpose

AI Debugging Tutor V1 should support multiple kinds of JavaScript and TypeScript debugging problems.

The first prototype uses an import/module-resolution error, but the finished V1 should not be limited to that category.

The tutor should be able to guide users through both:

- errors that produce compiler, build, lint, or runtime messages
- bugs where the program runs but produces the wrong output

---

## V1 Supported Error Categories

### 1. Syntax and Parse Errors

Category:

```ts
"syntax_parse_error"
```

Examples:

```ts
if (x > 3 {
  console.log(x);
}
```

```text
SyntaxError: Unexpected token
```

Tutor focus:

- reading parser messages
- finding the exact line/column
- matching parentheses, braces, brackets, and quotes
- understanding syntax structure

---

### 2. Import and Module-Resolution Errors

Category:

```ts
"import_module_resolution"
```

Examples:

```text
Cannot find module '@/components/StatCard'
```

Tutor focus:

- relative imports
- path aliases
- file locations
- exports/imports
- project structure
- TypeScript module resolution

---

### 3. TypeScript Type Errors

Category:

```ts
"typescript_type_error"
```

Examples:

```text
Type 'string' is not assignable to type 'number'.
```

Tutor focus:

- expected vs actual types
- function parameter types
- object shapes
- generics
- narrowing
- type annotations

---

### 4. Nullability Errors

Category:

```ts
"nullability_error"
```

Examples:

```text
Object is possibly 'null'.
Object is possibly 'undefined'.
```

Tutor focus:

- null
- undefined
- optional properties
- guard clauses
- optional chaining
- non-null assertions
- safe narrowing

---

### 5. Function Signature Errors

Category:

```ts
"function_signature_error"
```

Examples:

```text
Expected 2 arguments, but got 1.
```

Tutor focus:

- function parameters
- return values
- argument order
- overloads
- callbacks
- API contracts

---

### 6. Runtime Exceptions

Category:

```ts
"runtime_exception"
```

Examples:

```text
TypeError: Cannot read properties of undefined
ReferenceError: user is not defined
```

Tutor focus:

- stack traces
- variable state at runtime
- undefined values
- object property access
- control flow
- missing initialization

---

### 7. Incorrect Output / Logic Bugs

Category:

```ts
"incorrect_output_logic_error"
```

Examples:

```ts
function add(a: string, b: string) {
  return a + b;
}

console.log(add("2", "3"));
```

Expected:

```text
5
```

Actual:

```text
23
```

Tutor focus:

- expected vs actual output
- tracing values
- data types
- control flow
- operators
- conditionals
- loops
- off-by-one mistakes

This category is important because many beginner debugging problems do not produce an error message. The program runs, but the result is wrong.

---

### 8. Test Failures

Category:

```ts
"test_failure"
```

Examples:

```text
Expected: 5
Received: 23
```

Tutor focus:

- reading test output
- expected vs received values
- identifying the failing case
- tracing the tested function
- distinguishing test bugs from implementation bugs

---

### 9. React Hook Errors

Category:

```ts
"react_hook_error"
```

Examples:

```text
React Hook "useState" is called conditionally.
```

Tutor focus:

- Rules of Hooks
- component render flow
- conditional logic
- dependency arrays
- state updates

---

### 10. Next.js Server/Client Component Errors

Category:

```ts
"nextjs_server_client_error"
```

Examples:

```text
You're importing a component that needs useState. It only works in a Client Component.
```

Tutor focus:

- Server Components
- Client Components
- `"use client"`
- boundaries between server and browser code
- data fetching patterns

---

### 11. Async Logic Errors

Category:

```ts
"async_logic_error"
```

Examples:

```ts
const data = fetchUser();
console.log(data.name);
```

Tutor focus:

- promises
- async/await
- missing await
- race conditions
- error handling
- loading states

---

### 12. Prisma Schema/Client Mismatches

Category:

```ts
"prisma_schema_client_mismatch"
```

Examples:

```text
Property 'profile' does not exist on type 'PrismaClient'.
```

Tutor focus:

- schema changes
- generated Prisma client
- migrations
- model fields
- relations
- type generation

---

### 13. State-Update Errors

Category:

```ts
"state_update_error"
```

Examples:

```ts
setCount(count + 1);
setCount(count + 1);
```

Expected:

```text
count increases by 2
```

Actual:

```text
count increases by 1
```

Tutor focus:

- stale state
- functional updates
- React batching
- immutable updates
- arrays and objects in state

---

### 14. Configuration Errors

Category:

```ts
"configuration_error"
```

Examples:

```text
Module not found: Can't resolve '@/lib/utils'
```

when the path alias is missing from `tsconfig.json`.

Tutor focus:

- tsconfig
- package.json
- ESLint config
- Next.js config
- environment variables
- build settings

---

## Unknown Category

Category:

```ts
"unknown"
```

Use this when the tutor cannot confidently classify the issue.

The tutor should still try to help, but it should be honest about uncertainty and ask for more context.

---

## Required Inputs by Error Type

Different bugs require different inputs.

### Compiler, Lint, Build, and Runtime Errors

Usually need:

- raw error message
- file path
- line and column number
- nearby code
- stack trace if available
- relevant imports and exports

### Incorrect Output / Logic Bugs

Usually need:

- code being run
- expected output
- actual output
- input values
- test case if available

### Test Failures

Usually need:

- failing test name
- expected value
- received value
- tested function
- relevant test code

---

## V1 Priority Order

The V1 implementation should support these in this order:

1. Import/module-resolution errors
2. Incorrect-output logic bugs
3. TypeScript type errors
4. Nullability errors
5. Runtime exceptions
6. Test failures
7. React/Next.js-specific errors
8. Async logic errors
9. Prisma/configuration errors

This gives the tutor coverage across beginner bugs, normal TypeScript bugs, and modern web app bugs.