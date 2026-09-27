import type { DashboardMetrics, MomentumDataPoint, SparklineData } from '@/types';

export const dashboardMetrics: DashboardMetrics = {
  readiness: {
    score: 72,
    maxScore: 100,
    changePercent: 6,
    changeDirection: 'up',
    label: 'Readiness score',
  },
  drift: {
    percent: 18,
    changeLabel: 'vs last week',
    severity: 'medium',
  },
  revisionDebt: {
    topicCount: 3,
    addedThisWeek: 2,
  },
  consistency: {
    daysActive: 4,
    totalDays: 7,
    label: 'This week',
  },
};

export const readinessSparkline: SparklineData = [58, 60, 63, 61, 65, 68, 66, 69, 70, 68, 71, 70, 72, 72];
export const driftSparkline: SparklineData = [8, 10, 9, 12, 11, 14, 13, 15, 16, 14, 17, 16, 18, 18];
export const debtSparkline: SparklineData = [1, 1, 1, 2, 2, 2, 1, 2, 2, 3, 2, 3, 3, 3];
export const consistencySparkline: SparklineData = [5, 6, 4, 5, 3, 5, 6, 4, 5, 4, 6, 5, 4, 4];

export const momentumData: MomentumDataPoint[] = [
  { date: 'Sep 14', day: 'Sun', planned: 120, actual: 95 },
  { date: 'Sep 15', day: 'Mon', planned: 120, actual: 110 },
  { date: 'Sep 16', day: 'Tue', planned: 120, actual: 130 },
  { date: 'Sep 17', day: 'Wed', planned: 120, actual: 85 },
  { date: 'Sep 18', day: 'Thu', planned: 120, actual: 100 },
  { date: 'Sep 19', day: 'Fri', planned: 120, actual: 115 },
  { date: 'Sep 20', day: 'Sat', planned: 90, actual: 70 },
  { date: 'Sep 21', day: 'Sun', planned: 90, actual: 40 },
  { date: 'Sep 22', day: 'Mon', planned: 120, actual: 105 },
  { date: 'Sep 23', day: 'Tue', planned: 120, actual: 60 },
  { date: 'Sep 24', day: 'Wed', planned: 120, actual: 125 },
  { date: 'Sep 25', day: 'Thu', planned: 120, actual: 110 },
  { date: 'Sep 26', day: 'Fri', planned: 120, actual: 95 },
  { date: 'Sep 27', day: 'Sat', planned: 90, actual: 45 },
];
