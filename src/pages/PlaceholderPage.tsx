import { motion } from 'framer-motion';
import { RefreshCw, Lightbulb, FlaskConical } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: 'recovery' | 'insights' | 'experiments';
}

const icons = {
  recovery: RefreshCw,
  insights: Lightbulb,
  experiments: FlaskConical,
};

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <Icon size={28} className="text-accent" strokeWidth={1.5} />
      </div>
      <h1 className="text-[2.5rem] font-bold text-text-primary tracking-tight leading-none mb-4">{title}</h1>
      <p className="text-[1.125rem] text-text-secondary max-w-md leading-relaxed">
        {description}
      </p>
      <div className="mt-8 px-4 py-2 bg-white border border-surface-border rounded-full shadow-sm text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">
        Feature in development
      </div>
    </motion.div>
  );
}
