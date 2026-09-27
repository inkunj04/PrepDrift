import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Logo } from '@/components/Logo';
import { student } from '@/data/student';
import { X, Compass } from 'lucide-react';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('prepdrift_welcome_dismissed');
    if (!hasSeenWelcome && location.pathname !== '/about') {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [location.pathname]);

  const dismissWelcome = () => {
    localStorage.setItem('prepdrift_welcome_dismissed', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface-base w-full overflow-hidden">
      {/* Desktop Sidebar Container (Spacer) */}
      <div 
        className={cn(
          "hidden lg:block flex-shrink-0 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between h-14 px-5 bg-white border-b border-surface-border sticky top-0 z-40 w-full flex-shrink-0">
        <Logo variant="icon" />
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-[0.625rem] font-semibold text-white leading-none">
            {student.avatarInitials}
          </span>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col w-full h-full lg:h-screen lg:overflow-y-auto pb-20 lg:pb-0 relative">
        <div className="w-full min-h-full flex flex-col px-5 sm:px-8 py-8">
          <Outlet />
        </div>

        {/* Welcome Prompt */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 w-full max-w-[340px] bg-white p-5 rounded-2xl border border-surface-border shadow-elevation-high z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
              <button 
                onClick={dismissWelcome}
                className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                aria-label="Dismiss welcome prompt"
              >
                <X size={16} strokeWidth={2} />
              </button>
              
              <div className="flex items-start gap-4 mb-4 mt-1">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Compass size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-body font-bold text-text-primary mb-1">New to PrepDrift?</h4>
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    See how the product works in 60 seconds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <Link
                  to="/about"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent text-white text-body-sm font-bold rounded-lg hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Explore PrepDrift
                </Link>
                <button
                  onClick={dismissWelcome}
                  className="px-4 py-2 bg-transparent text-text-secondary text-body-sm font-medium rounded-lg hover:bg-surface-subtle hover:text-text-primary active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
