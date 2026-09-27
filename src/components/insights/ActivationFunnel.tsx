import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FunnelStage } from '@/types/analytics';

interface ActivationFunnelProps {
  title?: string;
  subtitle?: string;
  stages: FunnelStage[];
}

export function ActivationFunnel({ title = 'Activation funnel', subtitle = 'Signup to D7 return', stages }: ActivationFunnelProps) {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const maxUsers = stages[0]?.users || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white p-8 rounded-xl border border-surface-border shadow-sm"
    >
      <h3 className="text-[1.25rem] font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-body-sm text-text-tertiary mb-8">{subtitle}</p>

      <div className="space-y-4">
        {stages.map((stage, i) => {
          const barWidth = Math.max(8, (stage.users / maxUsers) * 100);
          const isExpanded = expandedStage === i;

          return (
            <div key={stage.name}>
              <button
                onClick={() => setExpandedStage(isExpanded ? null : i)}
                className="w-full group"
              >
                <div className="flex items-center gap-2 sm:gap-6">
                  {/* Label */}
                  <div className="w-20 sm:w-32 text-right flex-shrink-0">
                    <span className="text-[0.625rem] sm:text-[0.6875rem] font-bold text-text-secondary uppercase tracking-widest group-hover:text-text-primary transition-colors">
                      {stage.name}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 relative">
                    <div className="h-8 sm:h-10 bg-surface-subtle rounded-lg overflow-hidden border border-surface-border group-hover:border-surface-border-strong transition-colors">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                        className={cn(
                          'h-full rounded-r-lg transition-colors duration-200',
                          i === 0 ? 'bg-accent' : 'bg-accent/80',
                          'group-hover:brightness-95'
                        )}
                      />
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="w-16 sm:w-24 text-right flex-shrink-0">
                    <span className="text-[0.875rem] sm:text-[1.125rem] font-bold text-text-primary tracking-tight">
                      {stage.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-12 sm:w-16 text-right flex-shrink-0">
                    <span className="text-caption sm:text-body-sm font-semibold text-text-tertiary group-hover:text-text-secondary transition-colors">
                      {stage.conversionRate}%
                    </span>
                  </div>

                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-text-tertiary flex-shrink-0 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-[9.5rem] mt-3 mb-2 px-5 py-4 bg-surface-subtle rounded-xl border border-surface-border mr-8"
                  >
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">Users</p>
                        <p className="text-[1.125rem] font-bold text-text-primary leading-none">{stage.users.toLocaleString()}</p>
                      </div>
                      <div className="border-l border-r border-surface-border-strong">
                        <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">Conversion</p>
                        <p className="text-[1.125rem] font-bold text-text-primary leading-none">{stage.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-[0.6875rem] font-bold text-status-critical uppercase tracking-widest mb-1">Drop-off</p>
                        <p className="text-[1.125rem] font-bold text-status-critical leading-none">
                          {stage.dropOff.toLocaleString()} <span className="text-body-sm">({stage.dropOffRate}%)</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
