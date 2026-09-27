import { motion } from 'framer-motion';
import { topics } from '@/data/topics';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Sparkline } from '@/components/Sparkline';
import { cn } from '@/lib/utils';

const statusColor: Record<string, string> = {
  healthy: '#16A34A',
  'needs-attention': '#D97706',
  drifting: '#DC2626',
};

export function TopicHealth() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="bg-white p-6 rounded-xl border border-surface-border shadow-sm h-full flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-[1.25rem] font-bold text-text-primary">Topic health</h3>
        <p className="text-body-sm text-text-tertiary mt-1">Accuracy and recency across subjects</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        {/* Table header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_80px_72px] gap-4 px-2 py-3 text-[0.6875rem] font-semibold text-text-tertiary uppercase tracking-wider border-b border-surface-border">
          <span>Topic</span>
          <span className="text-right">Accuracy</span>
          <span className="text-right">Last Prac</span>
          <span className="text-right">Trend</span>
          <span className="text-right">Status</span>
        </div>

        {/* Topic rows */}
        <div className="pt-2 space-y-1">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className={cn(
                'grid grid-cols-[1.5fr_1fr_1fr_80px_72px] gap-4 items-center px-2 py-3 rounded-lg transition-colors duration-200 hover:bg-surface-subtle group'
              )}
            >
              {/* Topic name */}
              <div className="flex flex-col">
                <span className="text-body-sm font-semibold text-text-primary truncate">{topic.name}</span>
                <span className="text-[0.6875rem] text-text-tertiary mt-0.5">
                  {topic.questionsAttempted}/{topic.totalQuestions}
                </span>
              </div>

              {/* Accuracy */}
              <div className="text-right">
                <span className={cn(
                  'text-body-sm font-bold',
                  topic.accuracy >= 75 ? 'text-status-healthy' :
                  topic.accuracy >= 65 ? 'text-status-warning' :
                  'text-status-critical'
                )}>
                  {topic.accuracy}%
                </span>
              </div>

              {/* Last practiced */}
              <div className="text-right">
                <span className="text-body-sm font-medium text-text-secondary">
                  {topic.lastPracticedDaysAgo === 0
                    ? 'Today'
                    : topic.lastPracticedDaysAgo === 1
                      ? 'Yesterday'
                      : `${topic.lastPracticedDaysAgo}d ago`}
                </span>
              </div>

              {/* Trend sparkline */}
              <div className="flex justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                <Sparkline
                  data={topic.trend}
                  width={48}
                  height={16}
                  color={statusColor[topic.status] || '#A1A1AA'}
                />
              </div>

              {/* Status */}
              <div className="flex justify-end">
                <StatusIndicator status={topic.status} size="sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
