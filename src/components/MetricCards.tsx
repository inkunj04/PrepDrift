import { motion } from 'framer-motion';
import { TrendingDown, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/Sparkline';
import { dashboardMetrics, driftSparkline, debtSparkline, consistencySparkline } from '@/data/metrics';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  sparklineData: number[];
  sparklineColor: string;
  icon: React.ReactNode;
  delay: number;
  accent?: 'green' | 'amber' | 'red' | 'blue';
}

function MetricCard({ title, value, subtitle, sparklineData, sparklineColor, icon, delay, accent = 'blue' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-5 bg-white border border-surface-border rounded-xl flex flex-col justify-between hover:border-surface-border-strong transition-colors"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border',
            accent === 'green' && 'bg-status-healthy-bg border-status-healthy/20',
            accent === 'amber' && 'bg-status-warning-bg border-status-warning/20',
            accent === 'red' && 'bg-status-critical-bg border-status-critical/20',
            accent === 'blue' && 'bg-accent-light border-accent/20',
          )}>
            {icon}
          </div>
          <span className="text-body-sm font-semibold uppercase tracking-wider text-text-secondary">{title}</span>
        </div>
        <Sparkline data={sparklineData} color={sparklineColor} width={48} height={20} />
      </div>
      <div>
        <div className="text-[2.25rem] font-bold text-text-primary tracking-tight leading-none mb-2">{value}</div>
        <p className="text-body-sm font-medium text-text-tertiary">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function MetricCards() {
  const { drift, revisionDebt, consistency } = dashboardMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Study Drift"
        value={`+${drift.percent}%`}
        subtitle={drift.changeLabel}
        sparklineData={driftSparkline}
        sparklineColor="#F59E0B"
        icon={<TrendingDown size={16} className="text-status-warning" />}
        delay={0.15}
        accent="amber"
      />
      <MetricCard
        title="Revision Debt"
        value={`${revisionDebt.topicCount}`}
        subtitle={`${revisionDebt.addedThisWeek} added this week`}
        sparklineData={debtSparkline}
        sparklineColor="#EF4444"
        icon={<AlertTriangle size={16} className="text-status-critical" />}
        delay={0.2}
        accent="red"
      />
      <MetricCard
        title="Consistency"
        value={`${consistency.daysActive}/${consistency.totalDays}`}
        subtitle={consistency.label}
        sparklineData={consistencySparkline}
        sparklineColor="#10B981"
        icon={<Calendar size={16} className="text-status-healthy" />}
        delay={0.25}
        accent="green"
      />
    </div>
  );
}
