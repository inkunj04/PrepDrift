import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { student } from '@/data/student';

export function SettingsPage() {
  const [sessionLength, setSessionLength] = useState('Medium (15-20 mins)');
  const [practicePref, setPracticePref] = useState('Practice + Recall');
  const [syntheticData, setSyntheticData] = useState(true);
  const [resetStatus, setResetStatus] = useState<'idle' | 'confirming' | 'resetting' | 'done'>('idle');

  // Load from local storage if available
  useEffect(() => {
    const savedSession = localStorage.getItem('prepdrift_session_length');
    if (savedSession) setSessionLength(savedSession);
    
    const savedPractice = localStorage.getItem('prepdrift_practice_pref');
    if (savedPractice) setPracticePref(savedPractice);
    
    const savedSynthetic = localStorage.getItem('prepdrift_synthetic_data');
    if (savedSynthetic !== null) setSyntheticData(savedSynthetic === 'true');
  }, []);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionLength(e.target.value);
    localStorage.setItem('prepdrift_session_length', e.target.value);
  };

  const handlePracticeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPracticePref(e.target.value);
    localStorage.setItem('prepdrift_practice_pref', e.target.value);
  };

  const handleSyntheticChange = () => {
    const nextVal = !syntheticData;
    setSyntheticData(nextVal);
    localStorage.setItem('prepdrift_synthetic_data', nextVal.toString());
  };

  const handleReset = () => {
    if (resetStatus === 'idle') {
      setResetStatus('confirming');
      return;
    }
    
    if (resetStatus === 'confirming') {
      setResetStatus('resetting');
      // Simulate reset
      setTimeout(() => {
        setResetStatus('done');
        setTimeout(() => setResetStatus('idle'), 2000);
      }, 800);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-20">
      
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-display-lg text-text-primary tracking-tight">Settings</h1>
        <p className="text-body text-text-secondary mt-1">
          Manage your study preferences and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_minmax(320px,1fr)] gap-8 lg:gap-10">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* PREPARATION */}
          <section className="bg-white rounded-card border border-surface-border shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-border bg-surface-base/30">
              <h2 className="text-heading text-text-primary">Preparation</h2>
            </div>
            <div className="divide-y divide-surface-border">
              
              <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between gap-6">
                <div className="mb-4 sm:mb-0">
                  <label className="text-body-sm font-medium text-text-primary block">Exam</label>
                  <p className="text-caption text-text-secondary mt-1">Your primary target examination.</p>
                </div>
                <div className="sm:w-[240px] flex-shrink-0">
                  <div className="w-full bg-surface-subtle border border-surface-border px-4 py-2.5 rounded-button text-body-sm text-text-secondary">
                    {student.exam}
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between gap-6">
                <div className="mb-4 sm:mb-0">
                  <label className="text-body-sm font-medium text-text-primary block">Study focus</label>
                  <p className="text-caption text-text-secondary mt-1">Current preparation phase.</p>
                </div>
                <div className="sm:w-[240px] flex-shrink-0">
                  <div className="w-full bg-surface-subtle border border-surface-border px-4 py-2.5 rounded-button text-body-sm text-text-secondary">
                    General Studies
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* STUDY PREFERENCES */}
          <section className="bg-white rounded-card border border-surface-border shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-border bg-surface-base/30">
              <h2 className="text-heading text-text-primary">Study preferences</h2>
            </div>
            <div className="divide-y divide-surface-border">
              
              <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between gap-6">
                <div className="mb-4 sm:mb-0">
                  <label className="text-body-sm font-medium text-text-primary block">Recovery session length</label>
                  <p className="text-caption text-text-secondary mt-1">Preferred duration for intervention sessions.</p>
                </div>
                <div className="sm:w-[240px] flex-shrink-0">
                  <select 
                    value={sessionLength}
                    onChange={handleSessionChange}
                    className="w-full bg-white border border-surface-border-strong text-body-sm text-text-primary rounded-button px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer shadow-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2371717A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                  >
                    <option value="Short (5-10 mins)">Short (5-10 mins)</option>
                    <option value="Medium (15-20 mins)">Medium (15-20 mins)</option>
                    <option value="Long (30+ mins)">Long (30+ mins)</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between gap-6">
                <div className="mb-4 sm:mb-0">
                  <label className="text-body-sm font-medium text-text-primary block">Practice preference</label>
                  <p className="text-caption text-text-secondary mt-1">Default mode for topic recovery.</p>
                </div>
                <div className="sm:w-[240px] flex-shrink-0">
                  <select 
                    value={practicePref}
                    onChange={handlePracticeChange}
                    className="w-full bg-white border border-surface-border-strong text-body-sm text-text-primary rounded-button px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer shadow-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2371717A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                  >
                    <option value="Practice + Recall">Practice + Recall</option>
                    <option value="Concept Review Only">Concept Review Only</option>
                    <option value="Quiz Only">Quiz Only</option>
                  </select>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* ACCOUNT */}
          <section className="bg-white rounded-card border border-surface-border shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-border bg-surface-base/30">
              <h2 className="text-heading text-text-primary">Account</h2>
            </div>
            <div className="px-6 py-6">
              <label className="text-body-sm font-medium text-text-primary block mb-2">Name</label>
              <div className="w-full bg-surface-subtle border border-surface-border px-4 py-2.5 rounded-button text-body-sm text-text-secondary">
                {student.name}
              </div>
            </div>
          </section>

          {/* DEMO DATA */}
          <section className="bg-white rounded-card border border-surface-border shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-border bg-surface-base/30">
              <h2 className="text-heading text-text-primary">Demo data</h2>
            </div>
            
            <div className="divide-y divide-surface-border">
              
              {/* Synthetic Data Toggle */}
              <div className="px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label 
                      htmlFor="synthetic-toggle"
                      className="text-body-sm font-medium text-text-primary cursor-pointer block mb-1"
                    >
                      Synthetic data
                    </label>
                    <p className="text-caption text-text-secondary">
                      Toggle realistic generated data for the portfolio demo.
                    </p>
                  </div>
                  <button 
                    id="synthetic-toggle"
                    role="switch"
                    aria-checked={syntheticData}
                    onClick={handleSyntheticChange}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer ${syntheticData ? 'bg-accent' : 'bg-surface-border-strong'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${syntheticData ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Reset Action */}
              <div className="px-6 py-6 bg-status-critical-bg/30">
                <div className="mb-5">
                  <h3 className="text-body-sm font-medium text-status-critical mb-1">Reset demo data</h3>
                  <p className="text-caption text-text-secondary">
                    Clear all generated sessions and reset state. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  disabled={resetStatus === 'resetting' || resetStatus === 'done'}
                  className={`w-full px-4 py-2.5 text-body-sm font-medium rounded-button transition-all duration-150 flex items-center justify-center gap-2 shadow-button hover:shadow-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-critical focus-visible:ring-offset-2 cursor-pointer ${
                    resetStatus === 'idle' ? 'bg-white text-status-critical border border-status-critical/30 hover:bg-status-critical hover:text-white active:scale-[0.98]' :
                    resetStatus === 'confirming' ? 'bg-status-critical text-white border border-transparent active:scale-[0.98]' :
                    resetStatus === 'resetting' ? 'bg-surface-subtle text-text-tertiary opacity-70 cursor-not-allowed border border-surface-border shadow-none' :
                    'bg-status-healthy/10 text-status-healthy border border-status-healthy/20 shadow-none'
                  }`}
                >
                  {resetStatus === 'idle' && 'Reset data'}
                  {resetStatus === 'confirming' && (
                    <>
                      <AlertCircle size={16} /> Confirm Reset
                    </>
                  )}
                  {resetStatus === 'resetting' && (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Resetting...
                    </>
                  )}
                  {resetStatus === 'done' && (
                    <>
                      <Check size={16} /> Data Reset
                    </>
                  )}
                </button>
              </div>

            </div>
          </section>

          {/* ABOUT */}
          <section className="pt-6">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-surface-subtle rounded-lg flex items-center justify-center border border-surface-border">
                  <SettingsIcon className="text-text-tertiary" size={16} />
                </div>
                <h3 className="text-body-sm font-semibold text-text-primary">PrepDrift</h3>
              </div>
              <p className="text-caption text-text-secondary">
                Professional study recovery for competitive exam preparation.
              </p>
              <p className="text-[0.6875rem] text-text-tertiary mt-4 uppercase tracking-wider font-medium">
                Demo Version 1.0.0
              </p>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
