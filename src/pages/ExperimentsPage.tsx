import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Users, Target, Activity, ShieldAlert, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { getExperimentData } from '@/lib/analytics';
import type { Experiment } from '@/types/analytics';
import { cn } from '@/lib/utils';

export function ExperimentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [drafts, setDrafts] = useState<Experiment[]>(() => {
    const saved = localStorage.getItem('prepdrift_experiment_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', problem: '', hypothesis: '', primaryMetric: '', audience: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const experiment = useMemo(() => {
    const draft = drafts.find(d => d.id === (id || 'EXP-001'));
    if (draft) return draft;
    return getExperimentData(id || 'EXP-001');
  }, [id, drafts]);

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Enter an experiment name.';
    if (!formData.problem.trim()) errors.problem = 'Enter a problem statement.';
    if (!formData.hypothesis.trim()) errors.hypothesis = 'Enter a hypothesis.';
    if (!formData.primaryMetric.trim()) errors.primaryMetric = 'Select or enter a primary metric.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const allIds = ['EXP-001', 'EXP-002', ...drafts.map(d => d.id)];
    const maxNum = Math.max(...allIds.map(d => parseInt(d.split('-')[1], 10)));
    const nextId = `EXP-${String(maxNum + 1).padStart(3, '0')}`;

    const newDraft: Experiment = {
      id: nextId,
      name: formData.name.trim(),
      problem: formData.problem.trim(),
      hypothesis: formData.hypothesis.trim(),
      audience: formData.audience.trim() || 'All users',
      primaryMetric: formData.primaryMetric.trim(),
      status: 'draft' as const,
      secondaryMetrics: [],
      guardrails: [],
      startDate: new Date().toISOString().split('T')[0],
      control: { name: 'Control', description: 'Current experience', users: 0, primaryMetric: 0, secondaryMetrics: {} },
      variant: { name: 'Variant', description: 'Proposed experience', users: 0, primaryMetric: 0, secondaryMetrics: {} },
      decision: '',
      nextStep: ''
    };

    const newDrafts = [...drafts, newDraft];
    setDrafts(newDrafts);
    localStorage.setItem('prepdrift_experiment_drafts', JSON.stringify(newDrafts));
    
    setIsModalOpen(false);
    setFormData({ name: '', problem: '', hypothesis: '', primaryMetric: '', audience: '' });
    setFormErrors({});
    navigate(`/experiments/${nextId}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-auto lg:h-[calc(100vh-6rem)]">
      
      {/* Left Sidebar: Experiments List */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col bg-white rounded-xl border border-surface-border overflow-hidden shadow-sm lg:h-full">
        <div className="p-4 border-b border-surface-border bg-surface-base">
          <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">Experiments</h3>
        </div>
        <div className="lg:flex-1 lg:overflow-y-auto p-2 flex flex-col sm:flex-row lg:flex-col gap-2">
          <Link
            to="/experiments/EXP-001"
            className={cn(
              'block w-full text-left px-3 py-2 rounded-lg text-body-sm transition-all duration-150 active:scale-[0.98]',
              experiment.id === 'EXP-001' ? 'bg-accent/10 text-accent font-semibold shadow-sm' : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium active:bg-surface-subtle/70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
            )}
          >
            EXP-001 (Retention)
          </Link>
          <Link
            to="/experiments/EXP-002"
            className={cn(
              'block w-full text-left px-3 py-2 rounded-lg text-body-sm transition-all duration-150 active:scale-[0.98]',
              experiment.id === 'EXP-002' ? 'bg-accent/10 text-accent font-semibold shadow-sm' : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium active:bg-surface-subtle/70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
            )}
          >
            EXP-002 (Conversion)
          </Link>
          {drafts.map(draft => (
            <Link
              key={draft.id}
              to={`/experiments/${draft.id}`}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg text-body-sm transition-all duration-150 active:scale-[0.98]',
                experiment.id === draft.id ? 'bg-accent/10 text-accent font-semibold shadow-sm' : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium active:bg-surface-subtle/70',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
              )}
            >
              {draft.id} (Draft)
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto pb-8 pr-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-display-lg text-text-primary tracking-tight">Experimentation</h1>
          <p className="text-heading text-text-secondary mt-2 font-normal">
            Validate hypotheses and measure the impact of product interventions.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-text-primary text-white text-body-sm font-medium rounded-lg hover:bg-black active:scale-[0.97] hover:shadow-button-hover transition-all duration-150 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
          New Draft
        </button>
      </div>

      {/* Active Experiment Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Spec */}
        <div className="xl:col-span-2 space-y-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-xl border border-surface-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className={cn(
                "px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest rounded flex items-center gap-2",
                experiment.status === 'running' ? "bg-status-healthy/10 text-status-healthy" : 
                experiment.status === 'draft' ? "bg-surface-subtle text-text-tertiary border border-surface-border" : 
                "bg-accent/10 text-accent"
              )}>
                {experiment.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-status-healthy animate-pulse" />}
                {experiment.status === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />}
                {experiment.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                {experiment.status}
              </span>
              <span className="text-caption font-mono text-text-tertiary font-medium bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">{experiment.id}</span>
            </div>
            
            <h2 className="text-[2rem] font-bold text-text-primary leading-tight mb-8 tracking-tight">{experiment.name}</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Target size={14} /> Problem Statement
                </h3>
                <p className="text-body text-text-primary leading-relaxed bg-surface-subtle p-4 rounded-lg border border-surface-border">{experiment.problem}</p>
              </div>
              
              <div>
                <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FlaskConical size={14} /> Hypothesis
                </h3>
                <p className="text-body text-text-primary leading-relaxed bg-accent/5 p-4 rounded-lg border border-accent/20">{experiment.hypothesis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-surface-border">
                <div>
                  <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users size={14} /> Audience
                  </h3>
                  <p className="text-body-sm font-medium text-text-primary">{experiment.audience}</p>
                </div>
                <div>
                  <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity size={14} /> Metrics
                  </h3>
                  <div className="space-y-2">
                    <p className="text-body-sm">
                      <span className="font-semibold text-text-primary">Primary: </span>
                      <span className="text-text-secondary">{experiment.primaryMetric}</span>
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      + {experiment.secondaryMetrics.length} secondary metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {experiment.status === 'draft' ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-subtle p-12 rounded-xl border border-surface-border shadow-sm text-center"
            >
              <FlaskConical size={32} className="mx-auto text-text-tertiary mb-4 opacity-50" />
              <h4 className="text-body font-bold text-text-primary mb-2">No results yet</h4>
              <p className="text-body-sm text-text-secondary max-w-sm mx-auto">
                Results will appear after this experiment is configured and run.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl border border-surface-border shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[1.5rem] font-bold text-text-primary tracking-tight">Results Summary</h3>
                <div className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-surface-subtle border border-surface-border rounded-lg cursor-help">
                  <span className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-wider">Simulated Experiment Data</span>
                  <div className="absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-3 w-[200px] sm:w-56 p-3 bg-text-primary text-white text-caption font-medium leading-relaxed rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-glass">
                    This prototype uses synthetic data. The observed difference is directional and does not establish causality.
                    {/* Tooltip arrow */}
                    <div className="absolute top-full right-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Control */}
                <div className="p-5 rounded-xl border border-surface-border bg-surface-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-body font-bold text-text-primary">{experiment.control.name}</span>
                    <span className="text-caption font-medium text-text-tertiary">{experiment.control.users.toLocaleString()} users</span>
                  </div>
                  <p className="text-caption font-medium text-text-secondary mb-5">{experiment.control.description}</p>
                  <div className="pt-4 border-t border-surface-border-strong">
                    <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">{experiment.primaryMetric}</p>
                    <p className="text-[2.25rem] font-bold text-text-primary leading-none tracking-tight">{experiment.control.primaryMetric}%</p>
                  </div>
                </div>

                {/* Variant */}
                <div className="p-5 rounded-xl border-2 border-accent bg-accent/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-body font-bold text-accent">{experiment.variant.name}</span>
                    <span className="text-caption font-medium text-text-tertiary">{experiment.variant.users.toLocaleString()} users</span>
                  </div>
                  <p className="text-caption font-medium text-text-secondary mb-5">{experiment.variant.description}</p>
                  <div className="pt-4 border-t border-accent/20">
                    <p className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">{experiment.primaryMetric}</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-[2.25rem] font-bold text-text-primary leading-none tracking-tight">{experiment.variant.primaryMetric}%</p>
                      <span className="text-body font-bold text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded">
                        +{Math.round((experiment.variant.primaryMetric - experiment.control.primaryMetric) * 10) / 10} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-text-primary rounded-xl p-6 text-white border border-surface-border">
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent mt-0.5" />
                  <div>
                    <h4 className="text-body font-bold mb-2">PM Decision</h4>
                    <p className="text-body-sm text-text-tertiary leading-relaxed mb-4">
                      {experiment.decision}
                    </p>
                    <div className="flex items-center gap-2 text-body-sm font-medium bg-white/10 px-3 py-2 rounded-lg w-fit">
                      <span className="text-accent uppercase tracking-widest text-[0.6875rem] font-bold">Next Step:</span>
                      {experiment.nextStep}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Col: Secondary Metrics & Guardrails */}
        <div className="space-y-8 min-w-0">
          {experiment.status !== 'draft' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white p-6 sm:p-8 rounded-xl border border-surface-border shadow-sm"
              >
                <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-6">Secondary Metrics</h3>
                <div className="space-y-6">
                  {experiment.secondaryMetrics.map((metric: string) => {
                    const cVal = experiment.control.secondaryMetrics[metric] || 0;
                    const vVal = experiment.variant.secondaryMetrics[metric] || 0;
                    const diff = Math.round((vVal - cVal) * 10) / 10;
                    return (
                      <div key={metric} className="pb-6 border-b border-surface-border last:border-0 last:pb-0">
                        <p className="text-body-sm font-semibold text-text-primary mb-4 leading-snug pr-4">{metric}</p>
                        <div className="flex flex-wrap sm:flex-nowrap items-end justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-[1.125rem] font-medium text-text-tertiary leading-none">{cVal}%</p>
                              <p className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-widest mt-2">Baseline</p>
                            </div>
                            <ArrowRight size={16} className="text-text-tertiary -mt-4 opacity-50" />
                            <div>
                              <p className="text-[1.125rem] font-bold text-text-primary leading-none">{vVal}%</p>
                              <p className="text-[0.625rem] font-bold text-accent uppercase tracking-widest mt-2">Variant</p>
                            </div>
                          </div>
                          {diff !== 0 && (
                            <div className="w-full sm:w-auto mt-2 sm:mt-0 flex sm:block justify-end">
                              <span className={cn(
                                'text-body-sm font-bold px-2.5 py-1 rounded-md mb-2 sm:mb-4 inline-block',
                                diff > 0 ? 'text-status-healthy bg-status-healthy/10' : 'text-status-critical bg-status-critical/10'
                              )}>
                                {diff > 0 ? '+' : ''}{diff} pts
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white p-6 rounded-xl border border-surface-border shadow-sm border-t-4 border-t-status-warning"
              >
                <h3 className="text-[1.25rem] font-bold text-text-primary mb-5 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-status-warning" />
                  Guardrails
                </h3>
                <div className="space-y-4">
                  {experiment.guardrails.map((g: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-warning mt-2 flex-shrink-0" />
                      <p className="text-body-sm font-medium text-text-secondary">{g}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
      </div>
      
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-xl border border-surface-border w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-surface-border shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-text-primary tracking-tight">Create experiment draft</h2>
                  <p className="text-body-sm text-text-secondary mt-1">Turn a product question into a testable hypothesis.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-text-tertiary hover:text-text-primary transition-colors" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="draft-form" onSubmit={handleCreateDraft} className="space-y-5">
                  <div>
                    <label className="block text-body-sm font-semibold text-text-primary mb-1.5">Experiment name</label>
                    <input type="text" value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setFormErrors({...formErrors, name: ''}) }} className={cn("w-full bg-surface-subtle border text-body-sm text-text-primary rounded-lg px-3 py-2 outline-none focus:ring-1 transition-all", formErrors.name ? "border-status-critical focus:border-status-critical focus:ring-status-critical" : "border-surface-border focus:border-accent focus:ring-accent")} placeholder="e.g. Onboarding Skip Button" />
                    {formErrors.name && <p className="text-[0.6875rem] font-bold text-status-critical mt-1.5">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-body-sm font-semibold text-text-primary mb-1.5">Problem statement</label>
                    <textarea value={formData.problem} onChange={e => { setFormData({...formData, problem: e.target.value}); setFormErrors({...formErrors, problem: ''}) }} className={cn("w-full bg-surface-subtle border text-body-sm text-text-primary rounded-lg px-3 py-2 outline-none focus:ring-1 transition-all min-h-[80px]", formErrors.problem ? "border-status-critical focus:border-status-critical focus:ring-status-critical" : "border-surface-border focus:border-accent focus:ring-accent")} placeholder="What problem are you trying to solve?" />
                    {formErrors.problem && <p className="text-[0.6875rem] font-bold text-status-critical mt-1.5">{formErrors.problem}</p>}
                  </div>
                  <div>
                    <label className="block text-body-sm font-semibold text-text-primary mb-1.5">Hypothesis</label>
                    <textarea value={formData.hypothesis} onChange={e => { setFormData({...formData, hypothesis: e.target.value}); setFormErrors({...formErrors, hypothesis: ''}) }} className={cn("w-full bg-surface-subtle border text-body-sm text-text-primary rounded-lg px-3 py-2 outline-none focus:ring-1 transition-all min-h-[80px]", formErrors.hypothesis ? "border-status-critical focus:border-status-critical focus:ring-status-critical" : "border-surface-border focus:border-accent focus:ring-accent")} placeholder="If we do X, then Y will happen..." />
                    {formErrors.hypothesis && <p className="text-[0.6875rem] font-bold text-status-critical mt-1.5">{formErrors.hypothesis}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-sm font-semibold text-text-primary mb-1.5">Primary metric</label>
                      <input type="text" value={formData.primaryMetric} onChange={e => { setFormData({...formData, primaryMetric: e.target.value}); setFormErrors({...formErrors, primaryMetric: ''}) }} className={cn("w-full bg-surface-subtle border text-body-sm text-text-primary rounded-lg px-3 py-2 outline-none focus:ring-1 transition-all", formErrors.primaryMetric ? "border-status-critical focus:border-status-critical focus:ring-status-critical" : "border-surface-border focus:border-accent focus:ring-accent")} placeholder="e.g. Conversion rate" />
                      {formErrors.primaryMetric && <p className="text-[0.6875rem] font-bold text-status-critical mt-1.5">{formErrors.primaryMetric}</p>}
                    </div>
                    <div>
                      <label className="block text-body-sm font-semibold text-text-primary mb-1.5">Audience <span className="text-text-tertiary font-normal">(Optional)</span></label>
                      <input type="text" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full bg-surface-subtle border border-surface-border text-body-sm text-text-primary rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="e.g. New users" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface-subtle">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-body-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                <button type="submit" form="draft-form" className="px-5 py-2.5 bg-text-primary text-white text-body-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm">Create Draft</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
