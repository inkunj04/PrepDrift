import { motion } from 'framer-motion';
import { TopBar } from '@/components/TopBar';
import { ReadinessCard } from '@/components/ReadinessCard';
import { MetricCards } from '@/components/MetricCards';
import { InsightCard } from '@/components/InsightCard';
import { MomentumChart } from '@/components/MomentumChart';
import { TopicHealth } from '@/components/TopicHealth';
import { ActivityTimeline } from '@/components/ActivityTimeline';

export function OverviewPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-16"
    >
      <TopBar />

      <div className="space-y-12 w-full">
        
        {/* HERO NARRATIVE SECTION */}
        <section className="pt-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_1.5fr] gap-8 items-center xl:items-start">
            {/* Readiness Summary */}
            <div className="flex items-center justify-center lg:justify-end xl:justify-center min-w-0">
              <ReadinessCard />
            </div>

            {/* Primary Drift Insight */}
            <div className="bg-white rounded-2xl border border-surface-border p-8 shadow-sm min-w-0">
              <InsightCard />
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-border w-full" />

        {/* METRICS & TRENDS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-subheading text-text-primary tracking-wide uppercase font-semibold">Supporting Signals</h2>
          </div>
          <MetricCards />
        </section>

        {/* EDITORIAL LAYOUT FOR DEEP DIVES */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-subheading text-text-primary tracking-wide uppercase font-semibold">Trajectory</h2>
            <MomentumChart />
          </div>
          <div className="space-y-6">
            <h2 className="text-subheading text-text-primary tracking-wide uppercase font-semibold">Topic Stability</h2>
            <TopicHealth />
          </div>
        </section>

        <section className="space-y-6 pt-6">
          <h2 className="text-subheading text-text-primary tracking-wide uppercase font-semibold">Recent Behavioral Signals</h2>
          <ActivityTimeline />
        </section>

      </div>
    </motion.div>
  );
}
