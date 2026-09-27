import type { TopicStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: TopicStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const statusConfig: Record<TopicStatus, { label: string; dotClass: string; textClass: string }> = {
  healthy: {
    label: 'Healthy',
    dotClass: 'bg-status-healthy',
    textClass: 'text-status-healthy',
  },
  'needs-attention': {
    label: 'Needs attention',
    dotClass: 'bg-status-warning',
    textClass: 'text-status-warning',
  },
  drifting: {
    label: 'Drifting',
    dotClass: 'bg-status-critical',
    textClass: 'text-status-critical',
  },
};

export function StatusIndicator({ status, size = 'sm', showLabel = true }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className="inline-flex items-center gap-1.5" role="status" aria-label={config.label}>
      <span className={cn('rounded-full flex-shrink-0', dotSize, config.dotClass)} />
      {showLabel && (
        <span className={cn('text-caption font-medium', config.textClass)}>
          {config.label}
        </span>
      )}
    </span>
  );
}
