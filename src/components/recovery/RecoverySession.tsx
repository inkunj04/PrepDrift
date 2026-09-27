import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, BookOpen, Target, Brain, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getConceptContent, getMCQsForTopic } from '@/lib/aiRecovery';
import type { RecoveryDiagnosis } from '@/types/analytics';

interface RecoverySessionProps {
  diagnosis: RecoveryDiagnosis;
  topicName: string;
  onComplete: () => void;
  onExit: () => void;
}
const stepColors = [
  'bg-accent/10 text-accent border-accent/20',
  'bg-status-warning/10 text-status-warning border-status-warning/20',
  'bg-accent-subtle text-accent border-accent-subtle/20',
  'bg-status-healthy/10 text-status-healthy border-status-healthy/20'
];
export function RecoverySession({ diagnosis, topicName, onComplete, onExit }: RecoverySessionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [recallText, setRecallText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const concept = useMemo(() => getConceptContent(topicName), [topicName]);
  const mcqs = useMemo(() => getMCQsForTopic(topicName, 5), [topicName]);
  const totalSteps = diagnosis.recoveryPlan.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const questionsAttempted = Object.keys(answers).length;
  const questionsCorrect = Object.values(answers).filter((v, i) => {
    const q = mcqs[i];
    return q && v === q.correctIndex;
  }).length;

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    setAnswers(prev => ({ ...prev, [mcqs[currentQuestionIdx].id]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < mcqs.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      nextStep();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setCurrentQuestionIdx(0);
    } else {
      setIsComplete(true);
    }
  };

  const accuracy = questionsAttempted > 0 ? Math.round((questionsCorrect / questionsAttempted) * 100) : 0;

  // ─── Completion State ───
  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-surface-base z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-md px-6 w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-status-healthy/10 border border-status-healthy/20 flex items-center justify-center mx-auto mb-8"
          >
            <Check size={32} className="text-status-healthy" strokeWidth={3} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight"
          >
            Recovery complete.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-body text-text-secondary mb-10 leading-relaxed"
          >
            You repaired one revision cycle and gave <span className="font-bold text-text-primary">{topicName}</span> another practice session.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-10"
          >
            <div className="bg-white p-5 rounded-xl border border-surface-border text-center shadow-sm">
              <p className="text-[1.5rem] font-bold text-text-primary leading-none mb-1">{diagnosis.recommendedDuration}m</p>
              <p className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-widest">Duration</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border text-center shadow-sm">
              <p className="text-[1.5rem] font-bold text-text-primary leading-none mb-1">{questionsAttempted}</p>
              <p className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-widest">Questions</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-surface-border text-center shadow-sm">
              <p className="text-[1.5rem] font-bold text-text-primary leading-none mb-1">{accuracy}%</p>
              <p className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-widest">Accuracy</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-surface-subtle p-6 rounded-xl border border-surface-border mb-10 flex items-center justify-between"
          >
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
              Next recommended review
            </span>
            <span className="text-body-sm font-bold text-text-primary">3 days</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onComplete}
            className="w-full px-8 py-4 bg-text-primary text-white text-[1.125rem] font-bold rounded-xl hover:bg-black active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
          >
            Review Progress
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── Active Session ───
  return (
    <div className="fixed inset-0 bg-surface-base z-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-surface-border bg-white shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-1 rounded">
            Recovery
          </span>
          <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="h-2 bg-surface-border-strong rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-subtle active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
          aria-label="Exit recovery session"
        >
          <X size={20} className="transition-transform duration-150" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Refresh */}
            {currentStep === 0 && (
              <motion.div
                key="refresh"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-8 h-8 rounded-full border flex items-center justify-center', stepColors[0])}>
                    <BookOpen size={16} />
                  </div>
                  <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
                    {diagnosis.recoveryPlan[0].durationMinutes} min
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight">Quick refresh</h2>
                <p className="text-[1.125rem] text-text-secondary mb-10 leading-relaxed max-w-xl">{diagnosis.recoveryPlan[0].description}</p>

                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-surface-border shadow-sm mb-8">
                  <h3 className="text-[1.75rem] font-bold text-text-primary mb-4 tracking-tight">{concept.title}</h3>
                  <p className="text-[1.125rem] text-text-secondary leading-relaxed mb-8">{concept.summary}</p>
                  <div className="space-y-4">
                    {concept.keyPoints.map((point, i) => {
                      const [term, ...descParts] = point.split(/[-:]/);
                      const desc = descParts.join('-').trim();
                      return (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-surface-border bg-surface-base/30">
                          <span className="text-[0.75rem] font-bold text-accent bg-accent/10 px-2 py-1 rounded mt-0.5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-body font-bold text-text-primary">{term.trim()}</p>
                            {desc && <p className="text-body-sm text-text-secondary leading-relaxed mt-1">{desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-accent text-white text-[1.125rem] font-bold rounded-xl hover:bg-accent-hover hover:shadow-button-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                >
                  Continue to Practice
                  <ChevronRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Practice MCQs */}
            {currentStep === 1 && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full border flex items-center justify-center', stepColors[1])}>
                      <Target size={16} />
                    </div>
                    <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
                      Question {currentQuestionIdx + 1} of {mcqs.length}
                    </span>
                  </div>
                  {questionsAttempted > 0 && (
                    <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest bg-surface-subtle px-3 py-1.5 rounded border border-surface-border">
                      Accuracy: {accuracy}%
                    </span>
                  )}
                </div>
                <h2 className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight">Targeted practice</h2>
                <p className="text-[1.125rem] text-text-secondary mb-10 leading-relaxed max-w-xl">{diagnosis.recoveryPlan[1].description}</p>

                {mcqs[currentQuestionIdx] && (
                  <div className="bg-white p-8 sm:p-10 rounded-2xl border border-surface-border shadow-sm mb-8">
                    <p className="text-[1.375rem] font-medium text-text-primary mb-8 leading-relaxed">
                      {mcqs[currentQuestionIdx].question}
                    </p>
                    <div className="space-y-3">
                      {mcqs[currentQuestionIdx].options.map((option, oi) => {
                        const isSelected = selectedOption === oi;
                        const isCorrect = oi === mcqs[currentQuestionIdx].correctIndex;
                        const showResult = showExplanation;
                        return (
                          <button
                            key={oi}
                            onClick={() => handleAnswer(oi)}
                            disabled={showExplanation}
                            className={cn(
                              'w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-150 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                              !showResult && 'hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.99] cursor-pointer',
                              showResult && isCorrect
                                ? 'border-status-healthy bg-status-healthy/5 text-status-healthy font-bold'
                                : showResult && isSelected && !isCorrect
                                  ? 'border-status-critical bg-status-critical/5 text-status-critical font-bold'
                                  : isSelected
                                    ? 'border-accent bg-accent/5 text-accent font-bold'
                                    : 'border-surface-border hover:border-surface-border-strong hover:bg-surface-subtle text-text-primary font-medium'
                            )}
                          >
                            <span className="font-bold mr-3 opacity-60">{String.fromCharCode(65 + oi)}.</span>
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-6 bg-surface-subtle rounded-xl border border-surface-border"
                      >
                        <p className="text-body text-text-secondary leading-relaxed">
                          <span className="font-bold text-text-primary block mb-2 uppercase tracking-widest text-[0.6875rem]">Explanation</span>
                          {mcqs[currentQuestionIdx].explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                  <button
                    onClick={handleNextQuestion}
                    className="group flex items-center justify-center gap-3 w-full sm:w-auto mt-8 px-8 py-4 bg-accent text-white text-[1.125rem] font-bold rounded-xl hover:bg-accent-hover hover:shadow-button-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                  >
                    {currentQuestionIdx < mcqs.length - 1 ? 'Next Question' : 'Continue to Recall'}
                    <ChevronRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
                  </button>
              </motion.div>
            )}

            {/* Step 3: Active Recall */}
            {currentStep === 2 && (
              <motion.div
                key="recall"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-8 h-8 rounded-full border flex items-center justify-center', stepColors[2])}>
                    <Brain size={16} />
                  </div>
                  <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
                    {diagnosis.recoveryPlan[2].durationMinutes} min
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight">Active recall</h2>
                <p className="text-[1.125rem] text-text-secondary mb-8 leading-relaxed max-w-xl">
                  Write what you remember about the core concepts of <span className="font-semibold text-text-primary">{topicName}</span> before checking the explanation.
                </p>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm mb-8 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-200">
                  <textarea
                    value={recallText}
                    onChange={e => setRecallText(e.target.value)}
                    placeholder="Type your explanation here..."
                    rows={7}
                    className="w-full resize-none bg-transparent text-[1.125rem] text-text-primary placeholder:text-text-tertiary focus:outline-none leading-relaxed"
                    aria-label="Active recall response"
                    disabled={showExplanation}
                  />
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-6 bg-surface-subtle rounded-xl border border-surface-border flex items-start gap-3"
                  >
                     <div className="w-5 h-5 rounded-full bg-accent/20 flex flex-shrink-0 items-center justify-center mt-0.5">
                        <span className="text-accent text-xs font-bold">i</span>
                     </div>
                    <p className="text-body-sm text-text-secondary leading-relaxed pt-0.5">
                      <span className="font-bold text-text-primary">Note: </span>
                      This prototype does not evaluate free-text responses yet. In a production environment, an LLM would provide specific feedback on your understanding here.
                    </p>
                  </motion.div>
                )}

                <button
                  onClick={() => {
                    if (!showExplanation) {
                      setShowExplanation(true);
                    } else {
                      nextStep();
                    }
                  }}
                  disabled={recallText.length < 10}
                  className={cn(
                    'group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-[1.125rem] font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                    recallText.length >= 10
                      ? 'bg-accent text-white hover:bg-accent-hover hover:shadow-button-hover active:scale-[0.98] cursor-pointer'
                      : 'bg-surface-subtle text-text-tertiary cursor-not-allowed border border-surface-border opacity-70'
                  )}
                >
                  {!showExplanation ? 'Submit response' : 'Continue to Review'}
                  <ChevronRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-8 h-8 rounded-full border flex items-center justify-center', stepColors[3])}>
                    <ClipboardCheck size={16} />
                  </div>
                  <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
                    {diagnosis.recoveryPlan[3].durationMinutes} min
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-bold text-text-primary mb-4 tracking-tight leading-tight">Review</h2>
                <p className="text-[1.125rem] text-text-secondary mb-10 leading-relaxed max-w-xl">Here's what you repaired in this session.</p>

                <div className="bg-white p-8 rounded-xl border border-surface-border shadow-sm mb-8 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-surface-border">
                    <span className="text-body font-medium text-text-secondary">Revision cycle added</span>
                    <span className="text-[1.125rem] font-bold text-status-healthy">+1</span>
                  </div>
                  <div className="flex items-center justify-between pb-6 border-b border-surface-border">
                    <span className="text-body font-medium text-text-secondary">Questions practiced</span>
                    <span className="text-[1.125rem] font-bold text-text-primary">{questionsAttempted}</span>
                  </div>
                  <div className="flex items-center justify-between pb-6 border-b border-surface-border">
                    <span className="text-body font-medium text-text-secondary">Recovery accuracy</span>
                    <span className="text-[1.125rem] font-bold text-text-primary">{accuracy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body font-medium text-text-secondary">Active recall</span>
                    <span className="text-body font-bold text-status-healthy px-3 py-1 bg-status-healthy/10 rounded">Completed</span>
                  </div>
                </div>

                <div className="bg-surface-subtle p-6 rounded-xl border border-surface-border mb-10 flex items-center justify-between">
                  <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
                    Next recommended review
                  </span>
                  <span className="text-body-sm font-bold text-text-primary">3 days, {topicName}</span>
                </div>

                <button
                  onClick={() => setIsComplete(true)}
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-text-primary text-white text-[1.125rem] font-bold rounded-xl hover:bg-black active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                >
                  Complete Recovery
                  <Check size={20} className="transition-transform duration-150 group-hover:scale-110" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
