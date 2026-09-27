import { Link } from 'react-router-dom';

import { 
  ArrowRight,
  TrendingDown,
  Target,
  Clock,
  LogOut,
  LayoutDashboard,
  RefreshCw,
  Lightbulb,
  FlaskConical,
  Database,
  GitPullRequest
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AboutPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto pb-24">
      {/* SECTION 1: HERO */}
      <section className="pt-8 pb-20 border-b border-surface-border">
        <div className="mb-6">
          <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded">
            Start Here
          </span>
        </div>
        <h1 className="text-[3rem] sm:text-[4rem] font-bold text-text-primary leading-[1.1] tracking-tight mb-8">
          Catch study drift before it becomes disengagement.
        </h1>
        <p className="text-[1.25rem] text-text-secondary leading-relaxed max-w-3xl mb-12">
          PrepDrift is an AI-powered study recovery prototype that detects early behavioural signals such as missed targets, declining accuracy, and revision debt, then turns those signals into a focused recovery session.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/recovery"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white text-[1.125rem] font-bold rounded-xl hover:bg-accent-hover hover:shadow-button-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Explore the Recovery Flow
            <ArrowRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/insights"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-text-primary text-[1.125rem] font-bold rounded-xl border border-surface-border hover:bg-surface-subtle hover:border-surface-border-strong active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            See Product Intelligence
          </Link>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          Study drift is gradual. Most interventions arrive too late.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Target,
              title: 'Missed targets',
              desc: 'One missed study target can become a pattern.'
            },
            {
              icon: TrendingDown,
              title: 'Declining accuracy',
              desc: 'Topics become weaker when practice and revision fall behind.'
            },
            {
              icon: Clock,
              title: 'Revision debt',
              desc: 'Unrevised topics accumulate until the backlog becomes harder to recover from.'
            },
            {
              icon: LogOut,
              title: 'Disengagement',
              desc: 'By the time a learner stops returning, the product may already have missed the opportunity to intervene.'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm hover:-translate-y-1 transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-border-strong flex items-center justify-center mb-6">
                  <Icon size={20} className="text-text-secondary" />
                </div>
                <h3 className="text-body font-bold text-text-primary mb-3">{item.title}</h3>
                <p className="text-body-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: THE PRODUCT IDEA */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight max-w-2xl">
          Instead of asking learners to study more, PrepDrift asks: what changed?
        </h2>
        <div className="flex flex-col gap-8 max-w-3xl">
          <div className="bg-surface-subtle p-8 rounded-2xl border border-surface-border opacity-70">
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest block mb-4">BEFORE</span>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-text-tertiary mt-2"></div>
              <div>
                <p className="text-body font-bold text-text-primary mb-1">Generic reminder</p>
                <p className="text-body text-text-secondary">"Don't forget to study today."</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center -my-2">
            <ArrowRight size={24} className="text-accent rotate-90" />
          </div>

          <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
            <span className="text-[0.6875rem] font-bold text-accent uppercase tracking-widest block mb-4 bg-accent/10 w-fit px-2 py-1 rounded">PREPDRIFT</span>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-status-critical mt-2"></div>
              <div>
                <p className="text-body font-bold text-text-primary mb-1">Behavioural signal</p>
                <p className="text-body text-text-secondary">"Your accuracy in Polity has fallen to 61% and it has been 11 days since your last revision."</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2">
            <ArrowRight size={24} className="text-status-healthy rotate-90" />
          </div>

          <div className="bg-status-healthy/5 p-8 rounded-2xl border border-status-healthy/20 shadow-sm">
            <span className="text-[0.6875rem] font-bold text-status-healthy uppercase tracking-widest block mb-4 bg-status-healthy/10 w-fit px-2 py-1 rounded">RECOVERY</span>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-status-healthy mt-2"></div>
              <div>
                <p className="text-body font-bold text-text-primary mb-1">Small contextual action</p>
                <p className="text-body text-text-secondary">"Refresh Polity with a focused 7-minute recovery session."</p>
              </div>
            </div>
          </div>
          
          <p className="text-[1.125rem] font-medium text-text-primary text-center mt-6">
            PrepDrift does not simply remind learners to study. It identifies why preparation is drifting and proposes the smallest useful recovery action.
          </p>
        </div>
      </section>

      {/* SECTION 4: HOW PREPDRIFT WORKS */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          How PrepDrift works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Observe', items: ['Practice activity', 'Target completion', 'Topic accuracy', 'Revision recency', 'Consistency'] },
            { step: '02', title: 'Detect', items: ['Missed targets', 'Inactive topics', 'Declining accuracy', 'Growing revision debt'] },
            { step: '03', title: 'Diagnose', items: ['Use the available behavioural signals to determine what needs attention.'] },
            { step: '04', title: 'Recover', items: ['Quick refresh', 'Targeted MCQs', 'Active recall'] },
            { step: '05', title: 'Measure', items: ['Observe whether the learner completes the recovery and returns.'] },
            { step: '06', title: 'Learn', items: ['Use product analytics and experiments to determine what should change next.'] }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col hover:border-surface-border-strong transition-colors">
              <span className="text-[0.75rem] font-bold text-accent mb-2 tracking-widest">STEP {s.step}</span>
              <h3 className="text-[1.25rem] font-bold text-text-primary mb-4">{s.title}</h3>
              <ul className="space-y-2 mt-auto">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-body-sm text-text-secondary">
                    <span className="text-surface-border-strong mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: WHAT YOU CAN EXPLORE */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          Explore the prototype
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: LayoutDashboard,
              title: 'Overview',
              desc: 'See the learner-facing dashboard, readiness score, study drift, revision debt, consistency, and the AI recovery recommendation.',
              cta: 'Explore Overview',
              to: '/'
            },
            {
              icon: RefreshCw,
              title: 'Recovery Mode',
              desc: 'Experience the core product loop from drift detection to targeted practice, active recall, and recovery completion.',
              cta: 'Try Recovery',
              to: '/recovery'
            },
            {
              icon: Lightbulb,
              title: 'Product Intelligence',
              desc: 'Explore activation, retention, conversion, drift analysis, behavioural segments, product opportunities, and the Product Control Center.',
              cta: 'View Insights',
              to: '/insights'
            },
            {
              icon: FlaskConical,
              title: 'Experiments',
              desc: 'See how product hypotheses become measurable experiments with primary metrics, secondary metrics, guardrails, and decision logic.',
              cta: 'View Experiments',
              to: '/experiments'
            },
            {
              icon: Database,
              title: 'SQL Explorer',
              desc: 'Explore the analytical layer behind the product using the synthetic event dataset.',
              cta: 'Open SQL Explorer',
              to: '/insights/sql'
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-[1.5rem] font-bold text-text-primary mb-3">{card.title}</h3>
                <p className="text-body text-text-secondary leading-relaxed mb-8 flex-1">{card.desc}</p>
                <Link
                  to={card.to}
                  className="group inline-flex items-center gap-2 text-[1rem] font-bold text-accent hover:text-accent-hover transition-colors w-fit"
                >
                  {card.cta} <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
          
          <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <GitPullRequest size={24} className="text-accent" />
            </div>
            <h3 className="text-[1.5rem] font-bold text-text-primary mb-3">Product Decisions</h3>
            <p className="text-body text-text-secondary leading-relaxed mb-8 flex-1">
              Understand why PrepDrift prioritises early recovery intervention instead of simply adding more reminders or building another generic AI tutor.
            </p>
            <div className="inline-flex items-center gap-2 text-[1rem] font-bold text-text-tertiary">
              See Product Thinking below
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE CORE RECOVERY EXPERIENCE */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          See the core loop in action
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-4 bg-surface-subtle p-8 rounded-3xl border border-surface-border mb-12">
          {[
            { label: 'Drift detected', val: 'Polity accuracy: 61%' },
            { label: 'Context identified', val: '11 days since revision' },
            { label: 'Recovery recommended', val: '7-minute targeted recovery' },
            { label: 'Practice', val: 'Targeted MCQs' },
            { label: 'Recall', val: 'Active recall' },
            { label: 'Outcome', val: 'Recovery completed', highlight: true }
          ].map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto text-center md:text-left">
              <div className="flex flex-col">
                <span className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">{step.label}</span>
                <span className={cn('text-body-sm font-bold', step.highlight ? 'text-status-healthy' : 'text-text-primary')}>
                  {step.val}
                </span>
              </div>
              {i < 5 && <ArrowRight size={16} className="text-surface-border-strong rotate-90 md:rotate-0" />}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/recovery"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white text-[1.125rem] font-bold rounded-xl hover:bg-accent-hover hover:shadow-button-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Try the recovery
            <ArrowRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* SECTION 7: WHAT MAKES THIS DIFFERENT */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          Not another generic AI study assistant.
        </h2>
        <div className="space-y-8">
          {[
            { title: 'Signal before reminder', desc: 'PrepDrift starts from observed learner behaviour instead of sending another generic reminder.' },
            { title: 'Smallest useful intervention', desc: "The goal is not another long study session. It is a focused recovery action that matches the learner's current problem." },
            { title: 'Product loop, not just learner loop', desc: 'Recovery outcomes feed into product analytics and experimentation, connecting learner behaviour with product decisions.' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-6 bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-surface-subtle flex flex-shrink-0 items-center justify-center border border-surface-border-strong font-bold text-text-secondary text-[1.125rem]">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[1.25rem] font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-[1.125rem] text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: THE PM / PRODUCT LAYER */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          Built as a product system, not just a UI prototype.
        </h2>
        <div className="bg-text-primary text-white p-10 rounded-3xl shadow-xl mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 relative">
            {[
              { title: 'OBSERVE', q: 'What are learners doing?' },
              { title: 'DIAGNOSE', q: 'Where is preparation drifting?' },
              { title: 'PRIORITIZE', q: 'Which problem is worth solving first?' },
              { title: 'EXPERIMENT', q: 'What intervention should we test?' },
              { title: 'MEASURE', q: 'Did behaviour change?' },
              { title: 'DECIDE', q: 'What should the product do next?' }
            ].map((node, i) => (
              <div key={i} className="flex flex-col z-10 relative">
                <span className="text-[0.75rem] font-bold text-white/50 mb-3 tracking-widest">{node.title}</span>
                <p className="text-[1.125rem] font-semibold text-white leading-tight">{node.q}</p>
                {i < 5 && <ArrowRight size={20} className="text-white/20 absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:block" />}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Link
            to="/insights"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-text-primary text-[1.125rem] font-bold rounded-xl border border-surface-border hover:bg-surface-subtle hover:border-surface-border-strong active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Explore Product Intelligence
            <ArrowRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* SECTION 9: EXPERIMENTS */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          From signal to experiment
        </h2>
        <p className="text-body text-text-secondary mb-10 max-w-2xl bg-surface-subtle p-4 rounded-lg border border-surface-border">
          <span className="font-bold text-text-primary">Note:</span> These are prototype experiments using synthetic data. They do not represent production users or validated impact.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest block mb-4">Experiment 1</span>
            <h3 className="text-[1.25rem] font-bold text-text-primary mb-3">Recovery Mode After First Missed Target</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              Test whether a contextual recovery intervention after a learner's first missed target can improve next-day return.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
            <span className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest block mb-4">Experiment 2</span>
            <h3 className="text-[1.25rem] font-bold text-text-primary mb-3">Contextual Upgrade Prompt After Recovery</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              Test whether a relevant upgrade prompt after a successful recovery moment increases exploration of the premium experience.
            </p>
          </div>
        </div>
        <Link
          to="/experiments"
          className="group inline-flex items-center gap-2 text-[1rem] font-bold text-accent hover:text-accent-hover transition-colors"
        >
          Explore Experiments <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* SECTION 10: DATA TRANSPARENCY */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-12 tracking-tight">
          What's real and what's simulated?
        </h2>
        <p className="text-[1.125rem] text-text-secondary leading-relaxed mb-10 max-w-3xl">
          This prototype uses synthetic analytics data to demonstrate how the product would reason about learner behaviour and product performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-status-healthy/5 p-8 rounded-2xl border border-status-healthy/20 shadow-sm">
            <h3 className="text-[1.25rem] font-bold text-status-healthy mb-6">Real in the prototype</h3>
            <ul className="space-y-3">
              {['Product flows', 'UI interactions', 'Recovery experience', 'Navigation', 'Calculations', 'Drift logic', 'Recommendation logic', 'Experiment structure', 'Analytics interface', 'SQL exploration experience'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-body text-text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-healthy"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-subtle p-8 rounded-2xl border border-surface-border shadow-sm">
            <h3 className="text-[1.25rem] font-bold text-text-secondary mb-6">Simulated</h3>
            <ul className="space-y-3">
              {['Learner population', 'Historical events', 'Experiment results', 'Retention cohorts', 'Conversion data', 'Product analytics dataset'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-body text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 11 & 12: WHAT THIS PROTOTYPE IS / EXPECTATIONS */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-6 tracking-tight">
          What you're looking at
        </h2>
        <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm mb-16 max-w-4xl">
          <p className="text-[1.125rem] text-text-primary leading-relaxed mb-6 font-medium">
            PrepDrift is a functional product prototype created to demonstrate how behavioural signals, AI-assisted recommendations, learning interventions, product analytics, and experimentation can work together in a single product loop.
          </p>
          <p className="text-[1.125rem] text-text-secondary leading-relaxed">
            This is not a production-ready exam preparation platform. It is a focused proof of concept showing the product experience, reasoning, analytics model, and experimentation framework.
          </p>
        </div>

        <h3 className="text-[1.75rem] font-bold text-text-primary mb-8 tracking-tight">
          What to expect while exploring
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'Functional flows', desc: 'You can interact with the core learner journey and recovery experience.' },
            { title: 'Simulated analytics', desc: 'Product intelligence uses synthetic data designed to demonstrate the analytical model.' },
            { title: 'Prototype-level AI', desc: 'AI recommendations are represented through deterministic/demo logic rather than a live production model.' },
            { title: 'PM thinking', desc: 'The prototype includes product metrics, event instrumentation, experiments, SQL exploration, and decision documentation.' }
          ].map((card, i) => (
            <div key={i} className="bg-surface-subtle p-6 rounded-2xl border border-surface-border">
              <h4 className="text-body font-bold text-text-primary mb-2">{card.title}</h4>
              <p className="text-body-sm text-text-secondary leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: RECOMMENDED EXPLORATION PATH */}
      <section className="py-20 border-b border-surface-border">
        <h2 className="text-[2.25rem] font-bold text-text-primary mb-4 tracking-tight">
          Recommended 3-minute walkthrough
        </h2>
        <p className="text-[0.875rem] font-semibold text-accent uppercase tracking-widest mb-12">
          Recommended for recruiters and product reviewers
        </p>
        <div className="space-y-6 max-w-3xl">
          {[
            { step: '01', title: 'Start with Overview', desc: 'See the learner problem and current drift signal.', cta: 'Open Overview', to: '/' },
            { step: '02', title: 'Try Recovery', desc: 'Experience the intervention from practice through active recall.', cta: 'Try Recovery', to: '/recovery' },
            { step: '03', title: 'Open Product Intelligence', desc: 'See how learner behaviour becomes product insight.', cta: 'View Insights', to: '/insights' },
            { step: '04', title: 'Review Experiments', desc: 'See how the product turns hypotheses into measurable tests.', cta: 'View Experiments', to: '/experiments' },
            { step: '05', title: 'Open SQL Explorer', desc: 'Inspect the analytical layer behind the prototype.', cta: 'Explore Data', to: '/insights/sql' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-2xl border border-surface-border shadow-sm group hover:border-surface-border-strong transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center flex-shrink-0 text-[1.125rem] font-bold text-text-secondary group-hover:bg-white transition-colors">
                {item.step}
              </div>
              <div className="flex-1">
                <h4 className="text-[1.125rem] font-bold text-text-primary mb-1">{item.title}</h4>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
              <Link
                to={item.to}
                className="inline-flex flex-shrink-0 items-center justify-center px-4 py-2 bg-surface-base text-text-primary text-body-sm font-bold rounded-lg border border-surface-border hover:bg-surface-subtle active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 14: PRODUCT PRINCIPLE */}
      <section className="pt-24 pb-12 text-center">
        <h2 className="text-[3rem] font-bold text-text-primary mb-6 tracking-tight">
          Recovery over reminders.
        </h2>
        <p className="text-[1.25rem] text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
          When preparation starts drifting, the best intervention may not be more content. It may be the right small action at the right moment.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-text-primary text-white text-[1.125rem] font-bold rounded-xl hover:bg-black active:scale-[0.98] hover:shadow-button-hover transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Back to Overview
          <ArrowRight size={20} className="transition-transform duration-150 group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
