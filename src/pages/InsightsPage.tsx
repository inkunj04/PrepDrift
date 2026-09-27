import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Database, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/Sparkline';
import { computeKPIs, computeFunnel, computeConversionFunnel, computeSegments, computeDriftDistribution } from '@/lib/analytics';
// import { computeKeyInsight } from '@/lib/analytics';
import { datasetStats } from '@/data/generator';
import { ActivationFunnel } from '@/components/insights/ActivationFunnel';
import { DriftChart } from '@/components/insights/DriftChart';
import { SegmentPanel } from '@/components/insights/SegmentPanel';
import { OpportunityFinder } from '@/components/insights/OpportunityFinder';
import type { KPIData, BehavioralSegment } from '@/types/analytics';

export function InsightsPage() {
  const kpis = useMemo(() => computeKPIs(), []);
  const funnel = useMemo(() => computeFunnel(), []);
  const convFunnel = useMemo(() => computeConversionFunnel(), []);
  const segments = useMemo(() => computeSegments(), []);
  const driftDist = useMemo(() => computeDriftDistribution(), []);
  // FLAG: `keyInsight` is currently computed but never rendered. It looks like it should be displayed as a summary.
  // const keyInsight = useMemo(() => computeKeyInsight(), []);
  const [selectedSegment, setSelectedSegment] = useState<BehavioralSegment | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pb-16 w-full pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-display-lg text-text-primary tracking-tight">Product Intelligence</h1>
          <p className="text-heading text-text-secondary mt-2 font-normal">
            Understand where learners drift, why they disappear, and what to test next.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Link
            to="/insights/sql"
            className="flex items-center gap-2 px-4 py-2 bg-white text-body-sm font-medium text-text-primary border border-surface-border rounded-lg hover:border-surface-border-strong hover:bg-surface-subtle active:scale-95 transition-all duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
          >
            <Database size={16} />
            SQL Explorer
          </Link>
        </div>
      </div>

      {/* Synthetic data label */}
      <div className="flex items-center gap-1.5 mb-10 pb-6 border-b border-surface-border">
        <Info size={14} className="text-text-tertiary" />
        <span className="text-body-sm text-text-tertiary">
          {datasetStats.note} · {datasetStats.totalUsers.toLocaleString()} users · {datasetStats.totalEvents.toLocaleString()}+ events
        </span>
      </div>

      {/* Product Control Center */}
      <div className="mb-16 space-y-8">
        <div>
          <h2 className="text-[1.5rem] font-bold text-text-primary tracking-tight">Product Control Center</h2>
          <p className="text-body text-text-secondary mt-1 mb-6">
            Observe what is changing, decide what to test, and measure what happens next.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest bg-surface-subtle py-2 px-4 rounded-lg inline-flex">
            <span>Behavior</span> <ArrowRight size={12} />
            <span>Signal</span> <ArrowRight size={12} />
            <span className="text-accent">Opportunity</span> <ArrowRight size={12} />
            <span>Experiment</span> <ArrowRight size={12} />
            <span>Result</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.label} kpi={kpi} delay={0.05 + i * 0.05} />
          ))}
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Opportunity */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white p-6 rounded-xl border border-surface-border shadow-sm border-t-4 border-t-accent flex flex-col h-full">
            <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest mb-3 block">Top Opportunity</span>
            <h3 className="text-[1.125rem] font-bold text-text-primary leading-tight mb-5">First-target failure is associated with early disengagement.</h3>
            
            <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">Evidence (D7 Retention)</p>
            <div className="flex items-center gap-6 mb-5 border-l-2 border-surface-border-strong pl-4 py-1">
              <div>
                <p className="text-[1.25rem] font-bold text-status-critical leading-none">18.6%</p>
                <p className="text-caption text-text-secondary mt-1">after miss</p>
              </div>
              <div>
                <p className="text-[1.25rem] font-bold text-text-primary leading-none">36.9%</p>
                <p className="text-caption text-text-secondary mt-1">after comp.</p>
              </div>
            </div>
            
            <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">Hypothesis</p>
            <p className="text-body-sm text-text-secondary leading-relaxed mb-6 flex-1">
              A low-friction recovery intervention immediately after the first missed target may increase short-term return.
            </p>

            <Link to="/experiments/EXP-001" className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-surface-subtle text-body-sm font-medium text-text-primary rounded-lg hover:bg-surface-border active:scale-[0.98] transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer">
              Investigate Opportunity <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150" />
            </Link>
          </motion.div>

          {/* Active Experiment */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-surface-border shadow-sm border-t-4 border-t-status-healthy flex flex-col h-full">
            <span className="text-[0.6875rem] font-bold text-status-healthy uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-healthy animate-pulse" /> Active Experiment
            </span>
            <div className="mb-6">
              <span className="text-caption font-mono text-text-tertiary bg-surface-subtle px-2 py-0.5 rounded">EXP-001</span>
              <h3 className="text-[1.125rem] font-bold text-text-primary leading-tight mt-3">Recovery Mode After First Missed Target</h3>
            </div>
            
            <div className="border border-status-healthy/20 bg-status-healthy/5 p-4 rounded-lg mb-6 flex-1">
              <p className="text-[0.6875rem] font-bold text-status-healthy uppercase tracking-widest mb-2">Primary signal (Next-day)</p>
              <p className="text-[2rem] font-bold text-status-healthy leading-none">+5.6 pts</p>
            </div>

            <Link to="/experiments/EXP-001" className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-text-primary text-white text-body-sm font-medium rounded-lg hover:bg-black active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer">
              View Experiment Details
            </Link>
          </motion.div>

          {/* Next Decision */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white p-6 rounded-xl border border-surface-border shadow-sm border-t-4 border-t-text-tertiary flex flex-col h-full">
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3 block">Next Decision</span>
            <div className="bg-surface-subtle p-5 rounded-lg border border-surface-border mb-6 flex-1">
              <p className="text-body text-text-primary font-medium italic leading-relaxed">
                "Recovery Mode shows an encouraging directional signal. Continue testing with a larger sample before treating the result as causal evidence."
              </p>
            </div>
            <Link to="/experiments/EXP-001" className="inline-flex items-center justify-between w-full px-4 py-2.5 border border-surface-border text-body-sm font-medium text-text-primary rounded-lg hover:bg-surface-subtle active:scale-[0.98] transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer">
              Review Metrics <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="h-px w-full bg-surface-border my-12" />

      {/* Funnels & Deep Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ActivationFunnel stages={funnel} />
        <ActivationFunnel stages={convFunnel} title="Conversion funnel" subtitle="Recovery completion to subscription" />
      </div>

      {/* Two column: Drift Analysis + Conversion Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        <DriftChart data={driftDist} />

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-text-primary text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle at top right, #3B82F6 0%, transparent 70%)' }}
          />
          <div className="relative z-10">
            <span className="text-caption font-bold text-accent uppercase tracking-widest">
              Conversion Opportunity
            </span>
            <h3 className="text-[1.5rem] font-bold mt-3 mb-6 leading-tight">Users who complete recovery are more engaged.</h3>

            <div className="mb-6">
              <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
                Evidence
              </p>
              <p className="text-body-sm text-text-tertiary leading-relaxed">
                Users who complete recovery sessions are more engaged with the product, creating a natural point to test contextual upgrade messaging.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
                Hypothesis
              </p>
              <p className="text-body-sm text-text-tertiary leading-relaxed">
                A contextual upgrade prompt may perform better than a generic prompt when shown after a successful recovery.
              </p>
            </div>

            <Link
              to="/experiments/EXP-002"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white text-text-primary text-body font-medium rounded-lg hover:bg-surface-subtle active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 group w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
            >
              View EXP-002
              <ArrowRight size={18} className="transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Segments */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white p-8 rounded-xl border border-surface-border shadow-sm mb-12"
      >
        <div className="mb-8">
          <h3 className="text-[1.25rem] font-bold text-text-primary">Behavioral segments</h3>
          <p className="text-body-sm text-text-tertiary mt-1">User groups by study behavior patterns</p>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest border-b border-surface-border">
            <span>Segment</span>
            <span className="text-right">Users</span>
            <span className="text-right">Share</span>
            <span className="text-right">D7 Ret.</span>
            <span className="text-right">Readiness</span>
          </div>
          <div className="pt-2 space-y-1">
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg)}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 items-center px-4 py-4 rounded-lg w-full text-left hover:bg-surface-subtle hover:shadow-sm active:scale-[0.99] transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
              >
                <span className="text-body-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{seg.name}</span>
                <span className="text-body-sm font-medium text-text-secondary text-right">{seg.users.toLocaleString()}</span>
                <span className="text-body-sm font-medium text-text-secondary text-right">{seg.share}%</span>
                <span className={cn('text-body-sm font-bold text-right', seg.d7Retention > 30 ? 'text-status-healthy' : seg.d7Retention > 15 ? 'text-status-warning' : 'text-status-critical')}>
                  {seg.d7Retention}%
                </span>
                <span className="text-body-sm font-medium text-text-secondary text-right">{seg.avgReadiness}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Segment Detail Panel */}
      {selectedSegment && (
        <SegmentPanel segment={selectedSegment} onClose={() => setSelectedSegment(null)} />
      )}

      {/* Opportunity Finder */}
      <OpportunityFinder />
    </motion.div>
  );
}

// ─── KPI Card ───
function KPICard({ kpi, delay }: { kpi: KPIData; delay: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * kpi.value * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [kpi.value]);

  const ChangeIcon = kpi.changeDirection === 'up' ? TrendingUp : kpi.changeDirection === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-xl border border-surface-border flex flex-col justify-between shadow-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-body-sm font-semibold uppercase tracking-wider text-text-secondary">{kpi.label}</span>
        <Sparkline data={kpi.sparkline} width={48} height={20} color="#3B82F6" />
      </div>
      <div>
        <div className="text-[2rem] font-bold text-text-primary tracking-tight leading-none mb-3">
          {displayed}{kpi.format === 'percent' ? '%' : ''}
        </div>
        <div className="flex items-center gap-1.5">
          <ChangeIcon size={14} className={cn(
            kpi.changeDirection === 'up' ? 'text-status-healthy' :
            kpi.changeDirection === 'down' ? 'text-status-critical' : 'text-text-tertiary'
          )} />
          <span className={cn('text-caption font-bold',
            kpi.changeDirection === 'up' ? 'text-status-healthy' :
            kpi.changeDirection === 'down' ? 'text-status-critical' : 'text-text-tertiary'
          )}>
            {kpi.change > 0 ? '+' : ''}{kpi.change}% vs prior
          </span>
        </div>
      </div>
    </motion.div>
  );
}
