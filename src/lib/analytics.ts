import { analyticsUsers, analyticsEvents } from '@/data/generator';
import type {
  FunnelStage, BehavioralSegment, KPIData, DailyDriftDistribution,
  ProductOpportunity, EventName, UserSegment, Experiment
} from '@/types/analytics';

// ─── Helpers ───
function countUsersWithEvent(eventName: EventName): number {
  const userIds = new Set<string>();
  for (const e of analyticsEvents) {
    if (e.eventName === eventName) userIds.add(e.userId);
  }
  return userIds.size;
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10;
}

// ─── KPIs ───
export function computeKPIs(): KPIData[] {
  const total = analyticsUsers.length;
  const activated = analyticsUsers.filter(u => u.firstPracticeCompleted && u.completedOnboarding).length;
  const d7Returned = analyticsUsers.filter(u => u.d7Return).length;
  const firstTargetDone = analyticsUsers.filter(u => u.completedFirstTarget).length;
  const recoveryDone = analyticsUsers.filter(u => u.recoveryCompleted).length;
  const recoveryStartedCount = analyticsUsers.filter(u => u.recoveryStarted).length;

  return [
    {
      label: 'Activation',
      value: pct(activated, total),
      format: 'percent',
      change: 3.2,
      changeDirection: 'up',
      sparkline: [46, 47, 48, 49, 50, 49, 51, 52, 51, 52, 53, 52, 52, pct(activated, total)],
      definition: 'Users who completed onboarding and first practice',
      source: 'signup → onboarding_complete → first_practice',
      timePeriod: 'Cohort: Mar–Aug 2026',
    },
    {
      label: 'D7 Retention',
      value: pct(d7Returned, total),
      format: 'percent',
      change: -1.4,
      changeDirection: 'down',
      sparkline: [32, 31, 30, 31, 30, 29, 30, 29, 28, 29, 30, 29, 29, pct(d7Returned, total)],
      definition: 'Users who returned on day 7 after signup',
      source: 'day_7_return event',
      timePeriod: 'Cohort: Mar–Aug 2026',
    },
    {
      label: 'First Target Completion',
      value: pct(firstTargetDone, total),
      format: 'percent',
      change: 2.1,
      changeDirection: 'up',
      sparkline: [58, 59, 60, 61, 60, 62, 61, 63, 62, 63, 64, 63, 63, pct(firstTargetDone, total)],
      definition: 'Users who completed their first daily study target',
      source: 'target_completed (first instance per user)',
      timePeriod: 'Cohort: Mar–Aug 2026',
    },
    {
      label: 'Recovery Completion',
      value: pct(recoveryDone, recoveryStartedCount || 1),
      format: 'percent',
      change: 4.8,
      changeDirection: 'up',
      sparkline: [35, 36, 37, 38, 37, 39, 38, 40, 39, 41, 40, 41, 42, pct(recoveryDone, recoveryStartedCount || 1)],
      definition: 'Users who completed a recovery session after starting one',
      source: 'recovery_completed / recovery_started',
      timePeriod: 'Cohort: Mar–Aug 2026',
    },
    {
      label: 'Conversion',
      value: pct(analyticsUsers.filter(u => u.subscriptionStarted).length, total),
      format: 'percent',
      change: 0.5,
      changeDirection: 'up',
      sparkline: [2.5, 2.6, 2.7, 2.6, 2.8, 2.9, 2.8, 3.0, 3.1, 3.2, 3.1, 3.3, 3.4, pct(analyticsUsers.filter(u => u.subscriptionStarted).length, total)],
      definition: 'Users who started a subscription',
      source: 'subscription_started event',
      timePeriod: 'Cohort: Mar–Aug 2026',
    },
  ];
}

// ─── Activation Funnel ───
export function computeFunnel(): FunnelStage[] {
  const signups = analyticsUsers.length;
  const onboarded = analyticsUsers.filter(u => u.completedOnboarding).length;
  const practiced = analyticsUsers.filter(u => u.firstPracticeCompleted).length;
  const planned = countUsersWithEvent('study_plan_created');
  const d2 = analyticsUsers.filter(u => u.d2Return).length;
  const d7 = analyticsUsers.filter(u => u.d7Return).length;

  const stages: { name: string; eventName: EventName; users: number }[] = [
    { name: 'Signup', eventName: 'signup', users: signups },
    { name: 'Onboarding Complete', eventName: 'onboarding_complete', users: onboarded },
    { name: 'First Practice', eventName: 'first_practice', users: practiced },
    { name: 'Study Plan Created', eventName: 'study_plan_created', users: planned },
    { name: 'Day 2 Return', eventName: 'day_2_return', users: d2 },
    { name: 'Day 7 Return', eventName: 'day_7_return', users: d7 },
  ];

  return stages.map((stage, i) => {
    const prev = i === 0 ? stage.users : stages[i - 1].users;
    return {
      name: stage.name,
      eventName: stage.eventName,
      users: stage.users,
      conversionRate: pct(stage.users, stages[0].users),
      dropOff: prev - stage.users,
      dropOffRate: pct(prev - stage.users, prev),
    };
  });
}

// ─── Conversion Funnel ───
export function computeConversionFunnel(): FunnelStage[] {
  const recoveryCompleted = analyticsUsers.filter(u => u.recoveryCompleted).length;
  const upgradeViewed = analyticsUsers.filter(u => u.upgradeViewed).length;
  const upgradeCtaClicked = analyticsUsers.filter(u => u.upgradeCtaClicked).length;
  const upgradeStarted = analyticsUsers.filter(u => u.subscriptionStarted && u.upgradeCtaClicked).length; // Simplify for synthetic mock
  const subscriptionStarted = analyticsUsers.filter(u => u.subscriptionStarted).length;

  const stages: { name: string; eventName: EventName; users: number }[] = [
    { name: 'Recovery Completed', eventName: 'recovery_completed', users: recoveryCompleted },
    { name: 'Upgrade Viewed', eventName: 'upgrade_viewed', users: upgradeViewed },
    { name: 'Upgrade CTA Clicked', eventName: 'upgrade_cta_clicked', users: upgradeCtaClicked },
    { name: 'Upgrade Started', eventName: 'upgrade_started', users: upgradeStarted },
    { name: 'Subscription Started', eventName: 'subscription_started', users: subscriptionStarted },
  ];

  return stages.map((stage, i) => {
    const prev = i === 0 ? stage.users : stages[i - 1].users;
    return {
      name: stage.name,
      eventName: stage.eventName,
      users: stage.users,
      conversionRate: pct(stage.users, stages[0].users || 1),
      dropOff: prev - stage.users,
      dropOffRate: pct(prev - stage.users, prev || 1),
    };
  });
}

// ─── Behavioral Segments ───
export function computeSegments(): BehavioralSegment[] {
  const segmentMap: Record<UserSegment, { name: string; commonSignal: string; recommendedAction: string }> = {
    'consistent-learner': {
      name: 'Consistent Learners',
      commonSignal: 'Stable study patterns',
      recommendedAction: 'Maintain engagement with advanced challenges',
    },
    'early-drifter': {
      name: 'Early Drifters',
      commonSignal: 'First target missed',
      recommendedAction: 'Test Recovery Mode after first missed target',
    },
    'high-revision-debt': {
      name: 'High Revision Debt',
      commonSignal: '3+ topics overdue',
      recommendedAction: 'Automated revision scheduling intervention',
    },
    'low-practice-confidence': {
      name: 'Low Practice Confidence',
      commonSignal: 'Low MCQ accuracy, fewer attempts',
      recommendedAction: 'Difficulty-adjusted practice sets',
    },
    'returning-learner': {
      name: 'Returning Learners',
      commonSignal: 'Resumed after gap',
      recommendedAction: 'Personalized re-onboarding flow',
    },
  };

  const segments: BehavioralSegment[] = [];
  const total = analyticsUsers.length;

  for (const [seg, meta] of Object.entries(segmentMap) as [UserSegment, typeof segmentMap[UserSegment]][]) {
    const users = analyticsUsers.filter(u => u.segment === seg);
    const count = users.length;
    const d7 = users.filter(u => u.d7Return).length;
    const avgReadiness = Math.round(users.reduce((sum, u) => sum + u.readinessScore, 0) / (count || 1));

    segments.push({
      id: seg,
      name: meta.name,
      users: count,
      share: pct(count, total),
      d7Retention: pct(d7, count),
      avgReadiness,
      commonSignal: meta.commonSignal,
      recommendedAction: meta.recommendedAction,
    });
  }

  return segments.sort((a, b) => b.users - a.users);
}

// ─── Drift Distribution Over 7 Days ───
export function computeDriftDistribution(): DailyDriftDistribution[] {
  // Deterministic drift progression
  const distributions: DailyDriftDistribution[] = [
    { day: 'Day 1', stable: 82, watch: 12, drifting: 4, highRisk: 2 },
    { day: 'Day 2', stable: 72, watch: 17, drifting: 7, highRisk: 4 },
    { day: 'Day 3', stable: 64, watch: 20, drifting: 10, highRisk: 6 },
    { day: 'Day 4', stable: 58, watch: 21, drifting: 13, highRisk: 8 },
    { day: 'Day 5', stable: 52, watch: 22, drifting: 16, highRisk: 10 },
    { day: 'Day 6', stable: 48, watch: 22, drifting: 18, highRisk: 12 },
    { day: 'Day 7', stable: 44, watch: 22, drifting: 20, highRisk: 14 },
  ];

  return distributions;
}

// ─── Product Opportunities ───
export function computeOpportunities(): ProductOpportunity[] {
  // Calculate actual metrics from dataset
  const firstTargetHit = analyticsUsers.filter(u => u.completedFirstTarget);
  const firstTargetMissed = analyticsUsers.filter(u => !u.completedFirstTarget && u.firstPracticeCompleted);

  const d7HitRate = pct(firstTargetHit.filter(u => u.d7Return).length, firstTargetHit.length);
  const d7MissRate = pct(firstTargetMissed.filter(u => u.d7Return).length, firstTargetMissed.length);

  const highDebt = analyticsUsers.filter(u => u.revisionDebtCount >= 3);
  const lowDebt = analyticsUsers.filter(u => u.revisionDebtCount < 3);

  const recoveryUsers = analyticsUsers.filter(u => u.recoveryCompleted);
  const noRecoveryUsers = analyticsUsers.filter(u => !u.recoveryCompleted && u.driftScore > 40);

  const recoveryD2 = pct(recoveryUsers.filter(u => u.d2Return).length, recoveryUsers.length);
  const noRecoveryD2 = pct(noRecoveryUsers.filter(u => u.d2Return).length, noRecoveryUsers.length);

  return [
    {
      id: 'opp-1',
      title: 'First Target Failure',
      signal: 'High',
      impact: 'high',
      evidence: `D7 retention: ${d7HitRate}% (completed first target) vs ${d7MissRate}% (missed). Difference: ${(d7HitRate - d7MissRate).toFixed(1)} pts.`,
      metric: 'D7 retention',
      metricDelta: `${(d7HitRate - d7MissRate).toFixed(1)} pts`,
      hypothesis: 'If we show a personalised recovery intervention immediately after a learner\'s first missed target, more learners will return the following day.',
      suggestedExperiment: 'Recovery Mode after first missed target',
    },
    {
      id: 'opp-2',
      title: 'Revision Debt',
      signal: 'Medium',
      impact: 'medium',
      evidence: `Users with 3+ overdue topics have ${pct(highDebt.filter(u => u.d7Return).length, highDebt.length)}% D7 retention vs ${pct(lowDebt.filter(u => u.d7Return).length, lowDebt.length)}% for low-debt users.`,
      metric: 'Weekly activity',
      metricDelta: `${(pct(lowDebt.filter(u => u.d7Return).length, lowDebt.length) - pct(highDebt.filter(u => u.d7Return).length, highDebt.length)).toFixed(1)} pts`,
      hypothesis: 'Automated revision scheduling before debt exceeds 3 topics may reduce drift accumulation.',
      suggestedExperiment: 'Proactive revision reminders at debt = 2 topics',
    },
    {
      id: 'opp-3',
      title: 'Recovery Completion',
      signal: 'High',
      impact: 'high',
      evidence: `Users completing recovery sessions show ${recoveryD2}% next-day return vs ${noRecoveryD2}% for drifting users without recovery.`,
      metric: 'Next-day return',
      metricDelta: `${(recoveryD2 - noRecoveryD2).toFixed(1)} pts`,
      hypothesis: 'Recovery completion appears associated with stronger short-term return behavior. Worth testing causality via controlled experiment.',
      suggestedExperiment: 'Controlled A/B test of Recovery Mode prompting',
    },
    {
      id: 'opp-4',
      title: 'Conversion Opportunity',
      signal: 'High',
      impact: 'high',
      evidence: `Users who complete recovery sessions are more engaged with the product, creating a natural point to test contextual upgrade messaging.`,
      metric: 'Upgrade conversion',
      metricDelta: `Positive signal expected`,
      hypothesis: 'A contextual upgrade prompt may perform better than a generic prompt when shown after a successful recovery.',
      suggestedExperiment: 'Contextual Upgrade Prompt After Recovery',
    },
  ];
}

// ─── Key Insight (First target failure) ───
export function computeKeyInsight() {
  const firstTargetHit = analyticsUsers.filter(u => u.completedFirstTarget);
  const firstTargetMissed = analyticsUsers.filter(u => !u.completedFirstTarget && u.firstPracticeCompleted);

  const d7HitRate = pct(firstTargetHit.filter(u => u.d7Return).length, firstTargetHit.length);
  const d7MissRate = pct(firstTargetMissed.filter(u => u.d7Return).length, firstTargetMissed.length);

  return {
    title: 'First target failure is a meaningful retention signal.',
    hitRate: d7HitRate,
    missRate: d7MissRate,
    difference: Math.round((d7HitRate - d7MissRate) * 10) / 10,
    why: 'The first missed target appears to be an early point of disengagement. A lightweight recovery intervention may be worth testing before users accumulate more study debt.',
  };
}

// ─── Experiment Data ───
export function getExperimentData(id: string = 'EXP-001'): Experiment {
  if (id === 'EXP-002') {
    // EXP-002: Contextual Upgrade Prompt After Recovery
    const controlUsers = 1240;
    const variantUsers = 1238;
    const cClick = 8.4;
    const vClick = 11.1;
    const cConv = 2.7;
    const vConv = 3.8;

    return {
      id: 'EXP-002',
      name: 'Contextual Upgrade Prompt After Recovery',
      status: 'running' as const,
      problem: 'Some users who repeatedly need recovery may benefit from deeper personalised mentorship. Instead of showing generic upgrade prompts, test whether a contextual upgrade prompt shown after a meaningful recovery moment produces stronger conversion intent.',
      hypothesis: 'If an upgrade prompt is shown in a relevant context immediately after a successful recovery session, users may be more likely to explore a premium mentorship experience than users shown a generic upgrade prompt.',
      audience: 'Users who completed at least one recovery session and are not subscribed.',
      primaryMetric: 'Upgrade conversion rate',
      secondaryMetrics: ['Upgrade CTA click-through rate', 'Upgrade page view rate', 'Recovery completion'],
      guardrails: ['Study session completion', 'Recovery abandonment', 'Upgrade prompt dismissal'],
      startDate: '2026-09-20',
      control: {
        name: 'Control',
        description: 'Generic upgrade prompt ("Unlock more with Premium")',
        users: controlUsers,
        primaryMetric: cConv,
        secondaryMetrics: {
          'Upgrade CTA click-through rate': cClick,
          'Upgrade page view rate': 12.5,
          'Recovery completion': 42.1,
        },
      },
      variant: {
        name: 'Variant',
        description: 'Contextual upgrade prompt ("Your preparation is improving. Get deeper personalised guidance...")',
        users: variantUsers,
        primaryMetric: vConv,
        secondaryMetrics: {
          'Upgrade CTA click-through rate': vClick,
          'Upgrade page view rate': 14.8,
          'Recovery completion': 42.3,
        },
      },
      decision: 'The variant shows a positive directional signal in this simulated dataset. A production test would require randomized assignment, sufficient sample size, and monitoring for changes in learner behavior.',
      nextStep: 'Validate the result with a controlled production experiment before expanding the intervention.',
    };
  }

  // Calculate EXP-001 from dataset to maintain coherence
  const recoveryUsers = analyticsUsers.filter(u => u.recoveryStarted);
  const noRecoveryDrifters = analyticsUsers.filter(u => !u.recoveryStarted && u.driftScore > 40);

  const controlSize = Math.min(noRecoveryDrifters.length, 1020);
  const variantSize = Math.min(recoveryUsers.length, 1018);

  const controlReturn = pct(
    noRecoveryDrifters.slice(0, controlSize).filter(u => u.d2Return).length,
    controlSize
  );
  const variantReturn = pct(
    recoveryUsers.slice(0, variantSize).filter(u => u.d2Return).length,
    variantSize
  );

  const controlD7 = pct(
    noRecoveryDrifters.slice(0, controlSize).filter(u => u.d7Return).length,
    controlSize
  );
  const variantD7 = pct(
    recoveryUsers.slice(0, variantSize).filter(u => u.d7Return).length,
    variantSize
  );

  const recoveryStartRate = pct(
    recoveryUsers.length,
    recoveryUsers.length + noRecoveryDrifters.length
  );
  const recoveryCompletionRate = pct(
    recoveryUsers.filter(u => u.recoveryCompleted).length,
    recoveryUsers.length
  );

  return {
    id: 'EXP-001',
    name: 'Recovery Mode After First Missed Target',
    status: 'running' as const,
    problem: 'Early disengagement after first missed target. D7 retention drops significantly for users who fail their first study target.',
    hypothesis: 'If we show a personalised recovery intervention immediately after a learner\'s first missed target, more learners will return the following day.',
    audience: 'New users who miss their first daily study target (within first 7 days)',
    primaryMetric: 'Next-day return rate',
    secondaryMetrics: ['Recovery start rate', 'Recovery completion', 'D7 retention'],
    guardrails: ['Session abandonment', 'Notification dismissal'],
    startDate: '2026-09-15',
    control: {
      name: 'Control',
      description: 'Normal missed-target experience',
      users: controlSize,
      primaryMetric: controlReturn,
      secondaryMetrics: {
        'Recovery start rate': 0,
        'Recovery completion': 0,
        'D7 retention': controlD7,
      },
    },
    variant: {
      name: 'Variant',
      description: 'AI Recovery intervention',
      users: variantSize,
      primaryMetric: variantReturn,
      secondaryMetrics: {
        'Recovery start rate': recoveryStartRate,
        'Recovery completion': recoveryCompletionRate,
        'D7 retention': variantD7,
      },
    },
    decision: 'Variant shows an encouraging directional improvement in next-day return. The prototype treats this as a signal for further testing, not proof of causality.',
    nextStep: 'Run the experiment with a larger sample and monitor D7 retention as the primary success metric over 4 weeks.',
  };
}
