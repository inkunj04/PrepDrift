// ─── Student ───
export interface Student {
  id: string;
  name: string;
  firstName: string;
  exam: string;
  targetYear: number;
  avatarInitials: string;
  joinedDate: string;
}

// ─── Metrics ───
export interface ReadinessMetric {
  score: number;
  maxScore: number;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'neutral';
  label: string;
}

export interface DriftMetric {
  percent: number;
  changeLabel: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RevisionDebtMetric {
  topicCount: number;
  addedThisWeek: number;
}

export interface ConsistencyMetric {
  daysActive: number;
  totalDays: number;
  label: string;
}

export interface DashboardMetrics {
  readiness: ReadinessMetric;
  drift: DriftMetric;
  revisionDebt: RevisionDebtMetric;
  consistency: ConsistencyMetric;
}

// ─── Momentum ───
export interface MomentumDataPoint {
  date: string;
  day: string;
  planned: number;
  actual: number;
}

// ─── Topics ───
export type TopicStatus = 'healthy' | 'needs-attention' | 'drifting';

export interface Topic {
  id: string;
  name: string;
  accuracy: number;
  lastPracticed: string;
  lastPracticedDaysAgo: number;
  status: TopicStatus;
  questionsAttempted: number;
  totalQuestions: number;
  trend: number[];
}

// ─── Activity ───
export type ActivityType = 'practice' | 'revision' | 'module' | 'missed' | 'test';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  topic?: string;
}

// ─── AI Insight ───
export interface AIInsight {
  title: string;
  body: string;
  topic: string;
  accuracy: number;
  lastRevised: string;
  lastRevisedDaysAgo: number;
  actionLabel: string;
  severity: 'info' | 'warning' | 'critical';
}

// ─── Navigation ───
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

// ─── Sparkline data ───
export type SparklineData = number[];
