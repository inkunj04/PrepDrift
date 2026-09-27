import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  RefreshCw,
  Lightbulb,
  FlaskConical,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { student } from '@/data/student';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Recovery', path: '/recovery', icon: RefreshCw },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
  { label: 'Experiments', path: '/experiments', icon: FlaskConical },
];

const topItems = [
  { label: 'Start Here', path: '/about', icon: Compass },
];

const bottomItems = [
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const renderNavGroup = (title: string, items: typeof navItems) => (
    <div className="mb-6">
      {!collapsed && (
        <h3 className="px-4 mb-2 text-[0.6875rem] font-semibold text-sidebar-muted tracking-wider uppercase">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group flex items-center gap-3 rounded-[8px] transition-all duration-150',
                collapsed ? 'justify-center mx-3 py-2' : 'px-3 py-2 mx-2',
                isActive
                  ? 'bg-sidebar-active text-sidebar-text shadow-sm'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover active:bg-sidebar-active/70',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-base'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'flex-shrink-0 transition-colors duration-150',
                  isActive ? 'text-accent' : 'text-sidebar-muted group-hover:text-sidebar-text'
                )}
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {!collapsed && (
                <span className="text-body-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed top-0 left-0 h-screen z-40 flex flex-col bg-sidebar-base border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-[64px] border-b border-sidebar-border flex-shrink-0',
        collapsed ? 'justify-center px-0' : 'px-5'
      )}>
        <Logo collapsed={collapsed} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        {renderNavGroup('Welcome', topItems)}
        {renderNavGroup('Study', navItems.slice(0, 2))}
        {renderNavGroup('Product', navItems.slice(2, 4))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pb-4 space-y-1">
        {/* Collapse toggle */}
        <div className="px-2">
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center gap-3 rounded-[8px] w-full text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover active:bg-sidebar-active/70 transition-all duration-150',
              collapsed ? 'justify-center py-2' : 'px-3 py-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-base cursor-pointer'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeft size={18} strokeWidth={1.5} className="flex-shrink-0 transition-colors duration-150" />
            ) : (
              <>
                <PanelLeftClose size={18} strokeWidth={1.5} className="flex-shrink-0 transition-colors duration-150" />
                <span className="text-body-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Settings */}
        <div className="px-2">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-[8px] transition-all duration-150',
                  collapsed ? 'justify-center py-2' : 'px-3 py-2',
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text shadow-sm'
                    : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover active:bg-sidebar-active/70',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-base'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0 transition-colors duration-150',
                    isActive ? 'text-accent' : 'text-sidebar-muted group-hover:text-sidebar-text'
                  )}
                  size={18}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {!collapsed && <span className="text-body-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* User avatar */}
        <div className={cn(
          'flex items-center gap-3 pt-4 pb-2 border-t border-sidebar-border mt-3',
          collapsed ? 'justify-center mx-0' : 'mx-4'
        )}>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[0.6875rem] font-semibold text-white leading-none">
              {student.avatarInitials}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-medium text-sidebar-text truncate">{student.name}</p>
              <p className="text-caption text-sidebar-muted truncate">{student.exam}</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
