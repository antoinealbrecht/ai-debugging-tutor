export type IsoDateString = string;

export type ConfidenceLevel = "high" | "medium" | "low";

export type ProgrammingLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "json"
  | "other";

export type CodeLocation = {
  filePath: string;
  lineStart: number;
  lineEnd: number;
  columnStart?: number;
  columnEnd?: number;
  symbolName?: string;
};

export type SupportedErrorCategory =
  | "import_module_resolution"
  | "typescript_type_error"
  | "nullability_error"
  | "function_signature_error"
  | "react_hook_error"
  | "nextjs_server_client_error"
  | "async_logic_error"
  | "prisma_schema_client_mismatch"
  | "state_update_error"
  | "configuration_error"
  | "unknown";

export type ErrorSource =
  | "problems_panel"
  | "terminal"
  | "selected_text"
  | "manual_input";

export type ParsedError = {
  rawMessage: string;
  category: SupportedErrorCategory;
  source: ErrorSource;

  filePath?: string;
  line?: number;
  column?: number;

  errorCode?: string;
  symbolName?: string;

  stackFrames?: CodeLocation[];

  expectedType?: string;
  actualType?: string;

  frameworkClues?: string[];
};

export type RelevantFile = {
  filePath: string;
  language: ProgrammingLanguage;

  contentSnippet: string;

  lineStart: number;
  lineEnd: number;

  reasonIncluded: string;
};

export type ImportRelationship = {
  fromFile: string;
  importedPath: string;
  resolvedFile?: string;
  importedSymbols: string[];
  isResolved: boolean;
};

export type SymbolKind =
  | "function"
  | "class"
  | "component"
  | "type"
  | "interface"
  | "variable"
  | "constant"
  | "unknown";

export type SymbolReference = {
  name: string;
  kind: SymbolKind;
  definedIn: CodeLocation;
  exported: boolean;
};

export type RetrievalSignalType =
  | "exact_file_path"
  | "line_number"
  | "symbol_match"
  | "import_graph"
  | "ast_relationship"
  | "keyword_match"
  | "semantic_similarity"
  | "neighboring_code"
  | "config_file"
  | "previous_session_step";

export type RetrievalSignal = {
  type: RetrievalSignalType;
  description: string;
  confidence: ConfidenceLevel;
};

export type RepositoryContext = {
  rootPath: string;

  relevantFiles: RelevantFile[];

  imports: ImportRelationship[];

  symbols: SymbolReference[];

  configFiles: RelevantFile[];

  retrievalReasoning: RetrievalSignal[];
};

export type BugDiagnosis = {
  rootCause: string;

  confidence: ConfidenceLevel;

  relevantLocations: CodeLocation[];

  alternativeCauses: string[];

  expectedFix: string;

  conceptsRequired: string[];

  errorCategory: SupportedErrorCategory;
};

export type ResourceSource =
  | "MDN"
  | "TypeScript"
  | "React"
  | "Next.js"
  | "Node.js"
  | "Prisma"
  | "ESLint"
  | "Other";

export type Resource = {
  title: string;
  url: string;
  source: ResourceSource;

  reason: string;
  focus: string;

  relatedConcepts: string[];
};

export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

export type DebuggingLesson = {
  objective: string;
  estimatedDifficulty: LessonDifficulty;

  resources: Resource[];

  steps: DebuggingStep[];
};

export type ProgressiveHint = {
  level: 1 | 2 | 3;
  label: "Direction" | "Focus" | "Strong clue";
  text: string;
};

export type DebuggingStep = {
  id: string;

  objective: string;

  question: string;

  conceptsRequired: string[];

  hints: ProgressiveHint[];

  completionCriteria: string[];

  relatedLocations: CodeLocation[];
};

export type UserAnswer = {
  stepId: string;
  answerText: string;
  submittedAt: IsoDateString;
};

export type StepEvaluationStatus =
  | "correct"
  | "mostly_correct"
  | "partial"
  | "incorrect"
  | "unclear"
  | "clarification_requested";

export type StepEvaluation = {
  status: StepEvaluationStatus;

  whatWasRight: string;

  missingConcepts: string[];

  misconception: string | null;

  nextResponse: string;

  hintGiven?: ProgressiveHint;

  advanceToNextStep: boolean;
};

export type CodeChangeEvaluationStatus =
  | "fixes_root_cause"
  | "partially_fixes_root_cause"
  | "does_not_fix_root_cause"
  | "introduces_new_issue"
  | "unclear";

export type CodeChangeEvaluation = {
  status: CodeChangeEvaluationStatus;

  explanation: string;

  changedLocations: CodeLocation[];

  newIssuesIntroduced: string[];

  stillMissing: string[];

  userLikelyUnderstandsFix: boolean;

  advanceLesson: boolean;
};

export type RecommendedReview = {
  title: string;
  url: string;
  reason: string;
};

export type HintSummary = {
  totalHintsUsed: number;

  strongestHintUsed: 0 | 1 | 2 | 3;

  conceptsThatNeededHints: string[];
};

export type SessionResult = "self_solved" | "solution_revealed" | "abandoned";

export type FinalLearningReport = {
  sessionResult: SessionResult;

  rootCause: string;

  finalSolution: string;

  whatYouDidWell: string[];

  whereYouStruggled: string[];

  conceptsReinforced: string[];

  recommendedReview: RecommendedReview[];

  hintSummary: HintSummary;
};

export type DebuggingSessionStatus =
  | "in_progress"
  | "self_solved"
  | "solution_revealed"
  | "abandoned";

export type DebuggingSession = {
  id: string;

  startedAt: IsoDateString;
  endedAt?: IsoDateString;

  parsedError: ParsedError;

  repositoryContext: RepositoryContext;

  hiddenDiagnosis: BugDiagnosis;

  lesson: DebuggingLesson;

  currentStepId: string;

  answers: UserAnswer[];

  evaluations: StepEvaluation[];

  codeChangeEvaluations: CodeChangeEvaluation[];

  finalReport?: FinalLearningReport;

  status: DebuggingSessionStatus;
};

export type ConceptProgressStatus = "strong" | "improving" | "needs_review";

export type ConceptProgress = {
  concept: string;

  status: ConceptProgressStatus;

  timesEncountered: number;

  timesSolvedWithoutHint: number;

  timesHinted: number;

  timesSolutionRevealed: number;

  lastEncounteredAt: IsoDateString;
};

export type LearningProfile = {
  userId: string;

  bugsSolved: number;

  sessionsCompleted: number;

  sessionsRevealed: number;

  concepts: ConceptProgress[];

  repeatedMisconceptions: string[];
};
