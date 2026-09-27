import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { topics } from '@/data/topics';
import { buildDriftInputFromTopics, calculateDriftScore } from '@/lib/driftEngine';
import { generateDiagnosis, getRecoveryTopic } from '@/lib/aiRecovery';
import { RecoverySession } from '@/components/recovery/RecoverySession';


export function RecoveryPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const navigate = useNavigate();

  const diagnosis = useMemo(() => {
    const driftInput = buildDriftInputFromTopics(topics);
    const assessment = calculateDriftScore(driftInput);
    return generateDiagnosis({ studentName: 'Kunj', topics, driftAssessment: assessment });
  }, []);

  const targetTopic = useMemo(() => getRecoveryTopic(topics), []);

  if (sessionStarted) {
    return (
      <RecoverySession
        diagnosis={diagnosis}
        topicName={targetTopic.name}
        onComplete={() => {
          setSessionStarted(false);
          navigate('/');
        }}
        onExit={() => setSessionStarted(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full pb-8 lg:pb-12"
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-body-sm font-medium text-text-tertiary hover:text-text-primary active:scale-95 transition-all duration-150 mb-12 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md px-2 py-1 -ml-2"
        aria-label="Back to overview"
      >
        <ArrowLeft size={16} />
        Back to Overview
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Sparkles size={16} className="text-accent" />
          </div>
          <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest">
            Recovery Mode
          </span>
        </div>
        <h1 className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight">
          Let's get {targetTopic.name} moving again.
        </h1>
        <p className="text-[1.125rem] text-text-secondary max-w-lg mx-auto leading-relaxed">
          {diagnosis.diagnosis}
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <Clock size={14} className="text-text-tertiary" />
          <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
            {diagnosis.recommendedDuration} minute session
          </span>
        </div>
      </motion.div>

      {/* Evidence Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-12"
      >
        {diagnosis.evidenceCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-surface-border text-center shadow-sm">
            <p className="text-[2rem] font-bold text-text-primary leading-none mb-2 tracking-tight">{card.value}</p>
            <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">{card.label}</p>
            {card.subLabel && (
              <p className="text-caption font-bold text-status-critical mt-2 bg-status-critical/10 inline-block px-2 py-0.5 rounded">{card.subLabel}</p>
            )}
          </div>
        ))}
      </motion.div>

      {/* Why recommended */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white p-8 rounded-xl border border-surface-border shadow-sm mb-8"
      >
        <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-6">
          Why this was recommended
        </h3>
        <div className="space-y-4">
          {diagnosis.signals.map((signal, i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b border-surface-border last:border-0 last:pb-0">
              <span className="text-body-sm font-medium text-text-secondary">{signal.label}</span>
              <span className="text-body-sm font-bold text-text-primary">{signal.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-surface-border bg-surface-subtle -mx-8 -mb-8 p-8 rounded-b-xl">
          <p className="text-body-sm text-text-primary leading-relaxed">
            <span className="font-bold">Reasoning: </span>
            {diagnosis.reasoning}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">Confidence:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-surface-border-strong rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${diagnosis.confidence}%` }} />
              </div>
              <span className="text-caption font-bold text-text-primary">{diagnosis.confidence}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recovery Plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-xl border border-surface-border shadow-sm mb-10"
      >
        <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-6">
          Your recovery plan
        </h3>
        <div className="space-y-6">
          {diagnosis.recoveryPlan.map((step, i) => (
            <div key={step.id} className="flex items-start gap-5 relative">
              {i !== diagnosis.recoveryPlan.length - 1 && (
                <div className="absolute top-10 left-[1.125rem] w-px h-10 bg-surface-border-strong" />
              )}
              <div className="w-9 h-9 rounded-full bg-surface-subtle border border-surface-border-strong flex items-center justify-center flex-shrink-0 z-10 relative mt-0.5">
                <span className="text-caption font-bold text-text-secondary">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex-1 min-w-0 pt-1.5">
                <p className="text-body font-bold text-text-primary mb-1">{step.label}</p>
                <p className="text-body-sm text-text-secondary">{step.description}</p>
              </div>
              <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest flex-shrink-0 pt-2">
                {step.durationMinutes} min
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <button
          onClick={() => setSessionStarted(true)}
          className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-text-primary text-white text-[1.125rem] font-bold rounded-xl hover:bg-black active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
        >
          Start Recovery
          <ArrowRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
        </button>
      </motion.div>
    </motion.div>
  );
}
