import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  XCircle,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { activities } from '@/data/activity';
import type { ActivityType } from '@/types';

const activityIcons: Record<ActivityType, { icon: typeof BookOpen; color: string; bg: string }> = {
  practice: { icon: BookOpen, color: 'text-accent', bg: 'bg-accent-light' },
  revision: { icon: CheckCircle2, color: 'text-status-healthy', bg: 'bg-status-healthy-bg' },
  module: { icon: GraduationCap, color: 'text-accent', bg: 'bg-accent-light' },
  missed: { icon: XCircle, color: 'text-status-critical', bg: 'bg-status-critical-bg' },
  test: { icon: ClipboardCheck, color: 'text-status-warning', bg: 'bg-status-warning-bg' },
};

// Group activities by relative time
function groupActivities(items: typeof activities) {
  const groups: { label: string; items: typeof activities }[] = [];
  let currentLabel = '';

  for (const item of items) {
    const label = item.relativeTime.includes(',')
      ? item.relativeTime.split(',')[0]
      : item.relativeTime;

    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, items: [item] });
    } else {
      groups[groups.length - 1].items.push(item);
    }
  }

  return groups;
}

export function ActivityTimeline() {
  const groups = groupActivities(activities);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white p-6 rounded-xl border border-surface-border shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-[1.25rem] font-bold text-text-primary">Recent activity</h3>
        <p className="text-body-sm text-text-tertiary mt-1">Your study log</p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            {/* Day label */}
            <h4 className="text-[0.6875rem] font-semibold text-text-tertiary uppercase tracking-wider mb-3 px-1 border-b border-surface-border pb-1">
              {group.label}
            </h4>

            {/* Items */}
            <div className="space-y-1">
              {group.items.map((item, index) => {
                const config = activityIcons[item.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.55 + index * 0.04 }}
                    className="flex items-start gap-4 px-2 py-3 rounded-lg hover:bg-surface-subtle transition-colors duration-200 group"
                  >
                    {/* Icon */}
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border', config.bg, config.bg.replace('-bg', '/20').replace('bg-', 'border-'))}>
                      <Icon size={14} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="text-caption font-medium text-text-secondary mt-0.5">{item.description}</p>
                    </div>

                    {/* Topic tag */}
                    {item.topic && (
                      <span className="text-[0.6875rem] font-medium text-text-tertiary bg-surface-subtle px-2 py-0.5 rounded flex-shrink-0 mt-0.5 border border-surface-border opacity-70 group-hover:opacity-100 transition-opacity">
                        {item.topic}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
