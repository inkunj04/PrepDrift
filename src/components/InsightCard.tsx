import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { primaryInsight } from '@/data/insights';

export function InsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="relative flex flex-col h-full justify-center"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-status-warning/20">
          <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />
        </div>
        <span className="text-caption font-bold text-status-warning uppercase tracking-widest">
          Signal Detected
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[2rem] font-bold text-text-primary tracking-tight leading-tight mb-6">
        You're drifting in <span className="text-accent">Polity</span>.
      </h3>

      {/* Topic detail */}
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-4 sm:gap-8 mb-8 border-l-2 border-accent/20 pl-4 sm:pl-6 py-1">
        <div className="flex flex-col gap-1 min-w-[100px]">
          <span className="text-[1.5rem] font-bold text-text-primary tracking-tight leading-none">{primaryInsight.lastRevisedDaysAgo}</span>
          <span className="text-[0.6875rem] font-medium text-text-secondary uppercase tracking-wider mt-1">Days since revision</span>
        </div>
        <div className="flex flex-col gap-1 min-w-[100px]">
          <span className="text-[1.5rem] font-bold text-status-critical tracking-tight leading-none">{primaryInsight.accuracy}%</span>
          <span className="text-[0.6875rem] font-medium text-text-secondary uppercase tracking-wider mt-1">Current accuracy</span>
        </div>
        <div className="flex flex-col gap-1 min-w-[100px]">
          <span className="text-[1.5rem] font-bold text-status-warning tracking-tight leading-none">3</span>
          <span className="text-[0.6875rem] font-medium text-text-secondary uppercase tracking-wider mt-1">Revision debt</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <p className="text-body font-medium text-text-secondary mb-4">
          Refresh Polity with a 7-minute recovery session.
        </p>
        <Link
          to="/recovery"
          className="group inline-flex items-center gap-3 px-6 py-3 bg-accent text-white text-body font-bold rounded-[8px] hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
        >
          {primaryInsight.actionLabel}
          <ArrowRight
            size={18}
            className="transition-transform duration-150 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.div>
  );
}
