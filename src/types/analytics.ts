// ─── Phase 2: Analytics User ───
export interface AnalyticsUser {
  userId: string;
  name: string;
  exam: string;
  targetYear: number;
  signupDate: string;
  studyCapacityHours: number;
  currentStreak: number;
  readinessScore: number;
  subscriptionStatus: 'free' | 'trial' | 'active' | 'churned';
  segment: UserSegment;
  // Derived behavioral flags
  completedFirstTarget: boolean;
  completedOnboarding: boolean;
  firstPracticeCompleted: boolean;
  d2Return: boolean;
  d7Return: boolean;
  recoveryStarted: boolean;
  recoveryCompleted: boolean;
  revisionDebtCount: number;
  driftScore: number;
  // Phase 4: Conversion
  upgradeViewed?: boolean;
  upgradeCtaClicked?: boolean;
  subscriptionStarted?: boolean;
}

export type UserSegment =
  | 'consistent-learner'
  | 'early-drifter'
  | 'high-revision-debt'
  | 'low-practice-confidence'
  | 'returning-learner';

// ─── Phase 2: Event Model ───
export type EventName =
  | 'signup'
  | 'onboarding_complete'
  | 'first_practice'
  | 'study_plan_created'
  | 'target_completed'
  | 'target_missed'
  | 'mcq_started'
  | 'mcq_completed'
  | 'mcq_answer_wrong'
  | 'revision_started'
  | 'revision_completed'
  | 'ai_question_asked'
  | 'recovery_prompt_seen'
  | 'recovery_started'
  | 'recovery_completed'
  | 'day_2_return'
  | 'day_7_return'
  | 'subscription_viewed'
  | 'upgrade_viewed'
  | 'upgrade_cta_clicked'
  | 'upgrade_started'
  | 'subscription_started';

export interface AnalyticsEvent {
  eventId: string;
  userId: string;
  eventName: EventName;
  timestamp: string;
  sessionId: string;
  topic?: string;
  properties: Record<string, string | number | boolean>;
}

// ─── Phase 2: Drift Detection ───
export type DriftLevel = 'stable' | 'watch' | 'drifting' | 'high-risk';

export interface DriftSignal {
  signal: string;
  description: string;
  contribution: number;
  detected: boolean;
}

export interface DriftAssessment {
  score: number;
  level: DriftLevel;
  signals: DriftSignal[];
  topSignal: string;
}

// ─── Phase 2: AI Recovery ───
export interface RecoveryStep {
  id: string;
  label: string;
  type: 'refresh' | 'practice' | 'recall' | 'review';
  durationMinutes: number;
  description: string;
}

export interface RecoveryDiagnosis {
  diagnosis: string;
  primaryCause: string;
  reasoning: string;
  confidence: number;
  recommendedDuration: number;
  recoveryPlan: RecoveryStep[];
  evidenceCards: EvidenceCard[];
  signals: { label: string; value: string }[];
}

export interface EvidenceCard {
  value: string;
  label: string;
  subLabel?: string;
}

// ─── Phase 2: MCQ ───
export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

// ─── Phase 2: Recovery Session State ───
export interface RecoverySessionState {
  currentStep: number;
  isActive: boolean;
  isComplete: boolean;
  questionsAttempted: number;
  questionsCorrect: number;
  recallText: string;
  startTime: number | null;
  answers: Record<string, number>;
}

// ─── Phase 2: Funnel ───
export interface FunnelStage {
  name: string;
  eventName: EventName;
  users: number;
  conversionRate: number;
  dropOff: number;
  dropOffRate: number;
}

// ─── Phase 2: Experiment ───
export type ExperimentStatus = 'draft' | 'running' | 'completed' | 'stopped';

export interface ExperimentArm {
  name: string;
  description: string;
  users: number;
  primaryMetric: number;
  secondaryMetrics: Record<string, number>;
}

export interface Experiment {
  id: string;
  name: string;
  status: ExperimentStatus;
  hypothesis: string;
  problem: string;
  audience: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  guardrails: string[];
  control: ExperimentArm;
  variant: ExperimentArm;
  startDate: string;
  decision?: string;
  nextStep?: string;
}

// ─── Phase 2: Product Opportunity ───
export interface ProductOpportunity {
  id: string;
  title: string;
  signal: string;
  impact: 'high' | 'medium' | 'low';
  evidence: string;
  metric: string;
  metricDelta: string;
  hypothesis: string;
  suggestedExperiment: string;
}

// ─── Phase 2: SQL Query ───
export interface SavedQuery {
  id: string;
  name: string;
  description: string;
  sql: string;
  explanation: {
    measures: string;
    matters: string;
    limitation: string;
  };
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean)[][];
  rowCount: number;
  executionMs: number;
}

// ─── Phase 2: Segment ───
export interface BehavioralSegment {
  id: UserSegment;
  name: string;
  users: number;
  share: number;
  d7Retention: number;
  avgReadiness: number;
  commonSignal: string;
  recommendedAction: string;
}

// ─── Phase 2: Daily Drift Distribution ───
export interface DailyDriftDistribution {
  day: string;
  stable: number;
  watch: number;
  drifting: number;
  highRisk: number;
}

// ─── Phase 2: KPI Card ───
export interface KPIData {
  label: string;
  value: number;
  format: 'percent' | 'number';
  change: number;
  changeDirection: 'up' | 'down' | 'neutral';
  sparkline: number[];
  definition: string;
  source: string;
  timePeriod: string;
}
