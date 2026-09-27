import { analyticsUsers, analyticsEvents } from '@/data/generator';
import type { SavedQuery, QueryResult } from '@/types/analytics';

// ─── Saved Queries ───
export const savedQueries: SavedQuery[] = [
  {
    id: 'q1',
    name: 'Activation funnel',
    description: 'Step-by-step conversion from signup to D7 return',
    sql: `SELECT
  stage,
  users,
  ROUND(users * 100.0 / first_value(users) OVER (ORDER BY step_order), 1) AS conversion_pct
FROM (
  SELECT 'signup' AS stage, 1 AS step_order, COUNT(DISTINCT user_id) AS users FROM events WHERE event_name = 'signup'
  UNION ALL
  SELECT 'onboarding_complete', 2, COUNT(DISTINCT user_id) FROM events WHERE event_name = 'onboarding_complete'
  UNION ALL
  SELECT 'first_practice', 3, COUNT(DISTINCT user_id) FROM events WHERE event_name = 'first_practice'
  UNION ALL
  SELECT 'study_plan_created', 4, COUNT(DISTINCT user_id) FROM events WHERE event_name = 'study_plan_created'
  UNION ALL
  SELECT 'day_2_return', 5, COUNT(DISTINCT user_id) FROM events WHERE event_name = 'day_2_return'
  UNION ALL
  SELECT 'day_7_return', 6, COUNT(DISTINCT user_id) FROM events WHERE event_name = 'day_7_return'
) funnel
ORDER BY step_order;`,
    explanation: {
      measures: 'Counts unique users at each stage of the activation funnel, from initial signup through day 7 retention, and calculates the cumulative conversion percentage.',
      matters: 'Reveals where the largest user drop-offs occur in the early lifecycle. Identifying the steepest drop helps prioritize which stage to improve first.',
      limitation: 'This is a simplified sequential funnel. Users may complete stages out of order or skip stages entirely. The conversion rates assume a strict linear path.',
    },
  },
  {
    id: 'q2',
    name: 'D7 retention after first target miss',
    description: 'Compares day-7 return rate for users who completed vs missed their first target',
    sql: `SELECT
  CASE
    WHEN first_target_completed = true THEN 'Completed first target'
    ELSE 'Missed first target'
  END AS cohort,
  COUNT(DISTINCT user_id) AS users,
  COUNT(DISTINCT CASE WHEN d7_return = true THEN user_id END) AS returned_d7,
  ROUND(
    COUNT(DISTINCT CASE WHEN d7_return = true THEN user_id END) * 100.0
    / COUNT(DISTINCT user_id), 1
  ) AS d7_retention_pct
FROM learner_cohorts
WHERE first_practice_completed = true
GROUP BY 1
ORDER BY d7_retention_pct DESC;`,
    explanation: {
      measures: 'Compares D7 return behavior between users who completed their first study target and those who missed it, among users who at least started practicing.',
      matters: 'Helps evaluate whether first target completion is a meaningful retention signal. A large gap suggests the first target experience is a critical intervention point.',
      limitation: 'This is observational. Users who complete targets may differ systematically from those who don\'t (e.g., higher motivation). The gap is a signal, not proof of causation.',
    },
  },
  {
    id: 'q3',
    name: 'Revision debt segments',
    description: 'User distribution by revision debt level and associated retention',
    sql: `SELECT
  CASE
    WHEN revision_debt_count = 0 THEN 'No debt'
    WHEN revision_debt_count BETWEEN 1 AND 2 THEN 'Low debt (1-2)'
    WHEN revision_debt_count BETWEEN 3 AND 4 THEN 'Medium debt (3-4)'
    ELSE 'High debt (5+)'
  END AS debt_segment,
  COUNT(*) AS users,
  ROUND(AVG(readiness_score), 1) AS avg_readiness,
  ROUND(
    COUNT(CASE WHEN d7_return = true THEN 1 END) * 100.0 / COUNT(*), 1
  ) AS d7_retention_pct
FROM learner_cohorts
GROUP BY 1
ORDER BY avg_readiness DESC;`,
    explanation: {
      measures: 'Groups users by their revision debt level and shows how readiness score and D7 retention vary across debt segments.',
      matters: 'Identifies the threshold at which revision debt begins to correlate with lower engagement. Useful for deciding when to trigger proactive interventions.',
      limitation: 'Revision debt is calculated at a point in time. Users may have had periods of low debt followed by accumulation. Longitudinal tracking would be more precise.',
    },
  },
  {
    id: 'q4',
    name: 'Recovery completion',
    description: 'Recovery session funnel: prompted → started → completed',
    sql: `SELECT
  'Recovery prompt seen' AS stage,
  COUNT(DISTINCT user_id) AS users
FROM events WHERE event_name = 'recovery_prompt_seen'
UNION ALL
SELECT
  'Recovery started',
  COUNT(DISTINCT user_id)
FROM events WHERE event_name = 'recovery_started'
UNION ALL
SELECT
  'Recovery completed',
  COUNT(DISTINCT user_id)
FROM events WHERE event_name = 'recovery_completed'
ORDER BY users DESC;`,
    explanation: {
      measures: 'Tracks the three-stage recovery funnel: how many users saw the recovery prompt, started a session, and completed it.',
      matters: 'Understanding drop-off within the recovery flow helps optimize the intervention design. Low start rates suggest prompt placement issues; low completion suggests session length or content problems.',
      limitation: 'Some users may have been prompted multiple times. This counts unique users, not total prompt impressions.',
    },
  },
  {
    id: 'q5',
    name: 'Next-day return by recovery status',
    description: 'Compares next-day return for users who did vs did not start recovery',
    sql: `SELECT
  recovery_started,
  COUNT(DISTINCT user_id) AS users,
  COUNT(DISTINCT CASE
    WHEN day_2_return = true
    THEN user_id
  END) AS returned_users,
  ROUND(
    COUNT(DISTINCT CASE WHEN day_2_return = true THEN user_id END) * 100.0
    / COUNT(DISTINCT user_id), 1
  ) AS next_day_return_pct
FROM learner_cohorts
GROUP BY recovery_started;`,
    explanation: {
      measures: 'Compares next-day return behavior for users who started Recovery Mode versus those who did not.',
      matters: 'Helps evaluate whether recovery behavior is associated with short-term return. A higher return rate among recovery users suggests the intervention may be effective.',
      limitation: 'This is observational unless the users are randomly assigned. Users who choose to start recovery may be inherently more motivated.',
    },
  },
];

// ─── Query Executor ───
// Computes results from the actual synthetic dataset

function executeQuery(queryId: string): QueryResult {
  const start = performance.now();

  switch (queryId) {
    case 'q1': return executeActivationFunnel(start);
    case 'q2': return executeD7RetentionByTarget(start);
    case 'q3': return executeRevisionDebtSegments(start);
    case 'q4': return executeRecoveryCompletion(start);
    case 'q5': return executeNextDayReturn(start);
    default: return { columns: [], rows: [], rowCount: 0, executionMs: 0 };
  }
}

function executeActivationFunnel(start: number): QueryResult {
  const eventCounts: Record<string, number> = {};
  const stages = ['signup', 'onboarding_complete', 'first_practice', 'study_plan_created', 'day_2_return', 'day_7_return'];

  for (const stage of stages) {
    const userIds = new Set<string>();
    for (const e of analyticsEvents) {
      if (e.eventName === stage) userIds.add(e.userId);
    }
    eventCounts[stage] = userIds.size;
  }

  const signups = eventCounts['signup'] || analyticsUsers.length;
  const rows = stages.map(stage => {
    const users = stage === 'signup' ? analyticsUsers.length : (eventCounts[stage] || 0);
    return [stage, users, Math.round(users * 1000 / signups) / 10];
  });

  return {
    columns: ['stage', 'users', 'conversion_pct'],
    rows,
    rowCount: rows.length,
    executionMs: Math.round((performance.now() - start) * 10) / 10 + 60 + Math.random() * 40,
  };
}

function executeD7RetentionByTarget(start: number): QueryResult {
  const practiced = analyticsUsers.filter(u => u.firstPracticeCompleted);
  const hit = practiced.filter(u => u.completedFirstTarget);
  const missed = practiced.filter(u => !u.completedFirstTarget);

  const hitD7 = hit.filter(u => u.d7Return).length;
  const missedD7 = missed.filter(u => u.d7Return).length;

  const rows = [
    ['Completed first target', hit.length, hitD7, Math.round(hitD7 * 1000 / hit.length) / 10],
    ['Missed first target', missed.length, missedD7, Math.round(missedD7 * 1000 / (missed.length || 1)) / 10],
  ];

  return {
    columns: ['cohort', 'users', 'returned_d7', 'd7_retention_pct'],
    rows,
    rowCount: 2,
    executionMs: Math.round((performance.now() - start) * 10) / 10 + 70 + Math.random() * 30,
  };
}

function executeRevisionDebtSegments(start: number): QueryResult {
  const buckets = [
    { label: 'No debt', filter: (u: typeof analyticsUsers[0]) => u.revisionDebtCount === 0 },
    { label: 'Low debt (1-2)', filter: (u: typeof analyticsUsers[0]) => u.revisionDebtCount >= 1 && u.revisionDebtCount <= 2 },
    { label: 'Medium debt (3-4)', filter: (u: typeof analyticsUsers[0]) => u.revisionDebtCount >= 3 && u.revisionDebtCount <= 4 },
    { label: 'High debt (5+)', filter: (u: typeof analyticsUsers[0]) => u.revisionDebtCount >= 5 },
  ];

  const rows = buckets.map(b => {
    const users = analyticsUsers.filter(b.filter);
    const count = users.length;
    const avgReadiness = count > 0 ? Math.round(users.reduce((s, u) => s + u.readinessScore, 0) * 10 / count) / 10 : 0;
    const d7 = users.filter(u => u.d7Return).length;
    return [b.label, count, avgReadiness, count > 0 ? Math.round(d7 * 1000 / count) / 10 : 0];
  });

  return {
    columns: ['debt_segment', 'users', 'avg_readiness', 'd7_retention_pct'],
    rows: rows.sort((a, b) => (b[2] as number) - (a[2] as number)),
    rowCount: rows.length,
    executionMs: Math.round((performance.now() - start) * 10) / 10 + 55 + Math.random() * 35,
  };
}

function executeRecoveryCompletion(start: number): QueryResult {
  const promptSeen = new Set<string>();
  const started = new Set<string>();
  const completed = new Set<string>();

  for (const e of analyticsEvents) {
    if (e.eventName === 'recovery_prompt_seen') promptSeen.add(e.userId);
    if (e.eventName === 'recovery_started') started.add(e.userId);
    if (e.eventName === 'recovery_completed') completed.add(e.userId);
  }

  const rows = [
    ['Recovery prompt seen', promptSeen.size],
    ['Recovery started', started.size],
    ['Recovery completed', completed.size],
  ];

  return {
    columns: ['stage', 'users'],
    rows,
    rowCount: 3,
    executionMs: Math.round((performance.now() - start) * 10) / 10 + 45 + Math.random() * 25,
  };
}

function executeNextDayReturn(start: number): QueryResult {
  const recoveryYes = analyticsUsers.filter(u => u.recoveryStarted);
  const recoveryNo = analyticsUsers.filter(u => !u.recoveryStarted);

  const yesReturned = recoveryYes.filter(u => u.d2Return).length;
  const noReturned = recoveryNo.filter(u => u.d2Return).length;

  const rows: (string | number | boolean)[][] = [
    [true, recoveryYes.length, yesReturned, Math.round(yesReturned * 1000 / (recoveryYes.length || 1)) / 10],
    [false, recoveryNo.length, noReturned, Math.round(noReturned * 1000 / (recoveryNo.length || 1)) / 10],
  ];

  return {
    columns: ['recovery_started', 'users', 'returned_users', 'next_day_return_pct'],
    rows,
    rowCount: 2,
    executionMs: Math.round((performance.now() - start) * 10) / 10 + 65 + Math.random() * 20,
  };
}

export { executeQuery };
