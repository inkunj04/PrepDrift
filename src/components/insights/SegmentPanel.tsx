import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { BehavioralSegment } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface SegmentPanelProps {
  segment: BehavioralSegment;
  onClose: () => void;
}

export function SegmentPanel({ segment, onClose }: SegmentPanelProps) {
  return (
    <div className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-full bg-surface-base shadow-glass flex flex-col border-l border-surface-border"
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-border bg-white">
          <h2 className="text-[1.25rem] font-bold text-text-primary">{segment.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-subtle transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-subtle p-5 rounded-xl border border-surface-border">
              <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">Users in segment</p>
              <p className="text-[2rem] font-bold text-text-primary leading-none mb-2">{segment.users.toLocaleString()}</p>
              <p className="text-caption font-bold text-accent">{segment.share}% of total</p>
            </div>
            <div className="bg-surface-subtle p-5 rounded-xl border border-surface-border">
              <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">D7 Retention</p>
              <p className={cn(
                'text-[2rem] font-bold leading-none mb-2',
                segment.d7Retention > 30 ? 'text-status-healthy' : segment.d7Retention > 15 ? 'text-status-warning' : 'text-status-critical'
              )}>
                {segment.d7Retention}%
              </p>
              <p className="text-caption font-medium text-text-secondary">Avg readiness: {segment.avgReadiness}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-surface-border shadow-sm">
            <h4 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3">Identifying Signal</h4>
            <p className="text-body-sm font-medium text-text-primary leading-relaxed">{segment.commonSignal}</p>
          </div>

          <div className="bg-text-primary p-6 rounded-xl text-white shadow-sm border border-surface-border">
            <h4 className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest mb-3">Recommended PM Action</h4>
            <p className="text-body-sm leading-relaxed">{segment.recommendedAction}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
