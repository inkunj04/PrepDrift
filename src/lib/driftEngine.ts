import type { DriftAssessment, DriftSignal, DriftLevel } from '@/types/analytics';
import type { Topic } from '@/types';

interface DriftInput {
  targetMissedRecently: boolean;
  topicInactiveDays: number;
  accuracyDeclinePercent: number;
  revisionDebtCount: number;
  studyFrequencyDeclinePercent: number;
  streakBroken: boolean;
  sessionAbandoned: boolean;
}

// ─── Score Calculation ───
export function calculateDriftScore(input: DriftInput): DriftAssessment {
  const signals: DriftSignal[] = [];
  let score = 0;

  // 1. Target failure (+20)
  const targetSignal: DriftSignal = {
    signal: 'Target failure',
    description: 'Missed a daily or weekly study target recently',
    contribution: input.targetMissedRecently ? 20 : 0,
    detected: input.targetMissedRecently,
  };
  signals.push(targetSignal);
  score += targetSignal.contribution;

  // 2. Topic inactivity (+15)
  const inactiveDetected = input.topicInactiveDays > 7;
  const inactivitySignal: DriftSignal = {
    signal: 'Topic inactivity',
    description: `${input.topicInactiveDays} days since last revision`,
    contribution: inactiveDetected ? 15 : 0,
    detected: inactiveDetected,
  };
  signals.push(inactivitySignal);
  score += inactivitySignal.contribution;

  // 3. Accuracy decline (+20)
  const accDeclineDetected = input.accuracyDeclinePercent > 10;
  const accSignal: DriftSignal = {
    signal: 'Accuracy decline',
    description: `−${input.accuracyDeclinePercent} pts in weakest topic`,
    contribution: accDeclineDetected ? 20 : 0,
    detected: accDeclineDetected,
  };
  signals.push(accSignal);
  score += accSignal.contribution;

  // 4. Revision debt (+15)
  const debtDetected = input.revisionDebtCount >= 2;
  const debtSignal: DriftSignal = {
    signal: 'Revision debt',
    description: `${input.revisionDebtCount} topics overdue for revision`,
    contribution: debtDetected ? 15 : 0,
    detected: debtDetected,
  };
  signals.push(debtSignal);
  score += debtSignal.contribution;

  // 5. Study frequency decline (+15)
  const freqDetected = input.studyFrequencyDeclinePercent > 25;
  const freqSignal: DriftSignal = {
    signal: 'Reduced study frequency',
    description: `Study time down ${input.studyFrequencyDeclinePercent}% vs prior week`,
    contribution: freqDetected ? 15 : 0,
    detected: freqDetected,
  };
  signals.push(freqSignal);
  score += freqSignal.contribution;

  // 6. Streak break (+10)
  const streakSignal: DriftSignal = {
    signal: 'Streak break',
    description: 'Active study streak was broken',
    contribution: input.streakBroken ? 10 : 0,
    detected: input.streakBroken,
  };
  signals.push(streakSignal);
  score += streakSignal.contribution;

  // 7. Session abandonment (+5)
  const abandonSignal: DriftSignal = {
    signal: 'Session abandonment',
    description: 'Left a study session before completion',
    contribution: input.sessionAbandoned ? 5 : 0,
    detected: input.sessionAbandoned,
  };
  signals.push(abandonSignal);
  score += abandonSignal.contribution;

  // Cap at 100
  score = Math.min(score, 100);

  // Classify
  const level = classifyDrift(score);
  const detectedSignals = signals.filter(s => s.detected);
  const topSignal = detectedSignals.length > 0
    ? detectedSignals.sort((a, b) => b.contribution - a.contribution)[0].signal
    : 'No drift signals detected';

  return { score, level, signals, topSignal };
}

export function classifyDrift(score: number): DriftLevel {
  if (score <= 24) return 'stable';
  if (score <= 49) return 'watch';
  if (score <= 69) return 'drifting';
  return 'high-risk';
}

// ─── Build drift input from student's topic data ───
export function buildDriftInputFromTopics(topics: Topic[]): DriftInput {
  const worstTopic = [...topics].sort((a, b) => a.accuracy - b.accuracy)[0];
  const longestInactive = [...topics].sort((a, b) => b.lastPracticedDaysAgo - a.lastPracticedDaysAgo)[0];

  const accuracyDecline = worstTopic.trend.length >= 2
    ? Math.max(0, worstTopic.trend[0] - worstTopic.trend[worstTopic.trend.length - 1])
    : 0;

  const debtTopics = topics.filter(t => t.status === 'drifting' || t.status === 'needs-attention');

  return {
    targetMissedRecently: true,
    topicInactiveDays: longestInactive.lastPracticedDaysAgo,
    accuracyDeclinePercent: accuracyDecline,
    revisionDebtCount: debtTopics.length,
    studyFrequencyDeclinePercent: 18,
    streakBroken: false,
    sessionAbandoned: false,
  };
}

export const driftLevelConfig: Record<DriftLevel, { label: string; color: string; bg: string }> = {
  stable: { label: 'Stable', color: 'text-status-healthy', bg: 'bg-status-healthy-bg' },
  watch: { label: 'Watch', color: 'text-status-warning', bg: 'bg-status-warning-bg' },
  drifting: { label: 'Drifting', color: 'text-status-critical', bg: 'bg-status-critical-bg' },
  'high-risk': { label: 'High Risk', color: 'text-status-critical', bg: 'bg-status-critical-bg' },
};
