import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardMetrics } from '@/data/metrics';

export function ReadinessCard() {
  const { readiness } = dashboardMetrics;
  const [animatedScore, setAnimatedScore] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * readiness.score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [readiness.score]);

  const circumference = 2 * Math.PI * 76;
  const progress = (animatedScore / readiness.maxScore) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center justify-center"
    >
      {/* Circular progress */}
      <div className="relative flex-shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90 drop-shadow-sm">
          {/* Background track */}
          <circle
            cx="90"
            cy="90"
            r="76"
            stroke="#F4F4F5"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx="90"
            cy="90"
            r="76"
            stroke="#3B82F6"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[3.5rem] font-bold text-text-primary tracking-tighter leading-none">{animatedScore}</span>
          <div className="w-[100px] mt-2 flex justify-center">
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest text-center leading-tight block">{readiness.label}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
