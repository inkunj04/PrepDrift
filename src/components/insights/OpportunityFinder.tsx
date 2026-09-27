import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FlaskConical, Sparkles, Check, Loader2 } from 'lucide-react';
import { computeOpportunities } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function OpportunityFinder() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const opportunities = useMemo(() => computeOpportunities(), []);

  const handleScan = () => {
    if (isScanning || hasScanned) return;
    setIsScanning(true);
    setScanStep(0);

    // Fast simulation: ~800ms total
    setTimeout(() => setScanStep(1), 250);
    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => {
      setScanStep(3);
      setTimeout(() => {
        setIsScanning(false);
        setHasScanned(true);
      }, 300);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[1.5rem] font-bold text-text-primary">Discovered Opportunities</h3>
        {!hasScanned && !isScanning && (
          <button
            onClick={handleScan}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-body-sm font-semibold rounded-lg shadow-sm hover:bg-accent-hover transition-all duration-200"
          >
            <Sparkles size={16} />
            Find Opportunities
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!hasScanned && isScanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Loader2 size={20} className="text-accent animate-spin" />
              <span className="text-body font-bold text-text-primary">Analyzing learner behavior...</span>
            </div>
            <div className="space-y-3 text-left w-full max-w-[240px]">
              <div className="flex items-center gap-3 text-body-sm">
                {scanStep > 0 ? <Check size={16} className="text-status-healthy" /> : <div className="w-4" />}
                <span className={cn("transition-colors font-medium", scanStep > 0 ? "text-text-primary" : "text-text-tertiary")}>Reading activity logs</span>
              </div>
              <div className="flex items-center gap-3 text-body-sm">
                {scanStep > 1 ? <Check size={16} className="text-status-healthy" /> : <div className="w-4" />}
                <span className={cn("transition-colors font-medium", scanStep > 1 ? "text-text-primary" : "text-text-tertiary")}>Comparing cohorts</span>
              </div>
              <div className="flex items-center gap-3 text-body-sm">
                {scanStep > 2 ? <Check size={16} className="text-status-healthy" /> : scanStep === 2 ? <Loader2 size={16} className="text-accent animate-spin" /> : <div className="w-4" />}
                <span className={cn("transition-colors font-medium", scanStep >= 2 ? "text-text-primary" : "text-text-tertiary")}>Finding behavioral signals</span>
              </div>
            </div>
          </motion.div>
        )}

        {!hasScanned && !isScanning && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-12 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h4 className="text-[1.25rem] font-bold text-text-primary mb-3 tracking-tight">No opportunities scanned</h4>
            <p className="text-body text-text-secondary max-w-sm mx-auto mb-2 leading-relaxed">
              Run the AI opportunity finder to detect behavioral segments with the highest impact potential.
            </p>
          </motion.div>
        )}

        {hasScanned && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
        {opportunities.map((opp) => (
          <div key={opp.id} className="bg-white p-6 rounded-xl border border-surface-border shadow-sm flex flex-col h-full hover:border-surface-border-strong transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-body font-bold text-text-primary group-hover:text-accent transition-colors leading-tight">{opp.title}</h4>
              <span className={cn(
                'px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-widest rounded',
                opp.signal === 'High' ? 'bg-status-critical/10 text-status-critical' : 'bg-status-warning/10 text-status-warning'
              )}>
                {opp.signal} Signal
              </span>
            </div>
            
            <p className="text-body-sm text-text-secondary mb-6 flex-1 leading-relaxed">
              {opp.evidence}
            </p>

            <div className="pt-5 border-t border-surface-border">
              <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
                Suggested Experiment
              </p>
              <p className="text-body-sm font-semibold text-text-primary mb-4 italic">
                {opp.suggestedExperiment}
              </p>
              
              <Link 
                to="/experiments" 
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-surface-border rounded-lg text-body-sm font-bold text-text-primary hover:bg-surface-subtle transition-colors gap-2"
              >
                <FlaskConical size={16} className="text-text-tertiary" />
                Draft Experiment
              </Link>
            </div>
          </div>
        ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
