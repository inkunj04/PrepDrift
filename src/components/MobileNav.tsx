import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  RefreshCw,
  Lightbulb,
  FlaskConical,
  LucideIcon,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Start', path: '/about', icon: Compass },
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Recovery', path: '/recovery', icon: RefreshCw },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
  { label: 'Experiments', path: '/experiments', icon: FlaskConical },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-surface-border"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavButton key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </div>
    </nav>
  );
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer',
        isActive ? 'text-accent' : 'text-text-tertiary hover:text-text-primary hover:bg-surface-subtle',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="transition-colors duration-150" />
      <span className="text-[0.625rem] font-medium transition-colors duration-150">{item.label}</span>
    </Link>
  );
}
