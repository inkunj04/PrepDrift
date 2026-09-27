import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'full' | 'icon';
  collapsed?: boolean; // Kept for backward compatibility
  className?: string;
}

export function Logo({ variant, collapsed = false, className }: LogoProps) {
  // Determine actual variant. Explicit variant prop takes precedence over collapsed prop.
  const actualVariant = variant || (collapsed ? 'icon' : 'full');

  return (
    <Link 
      to="/" 
      className={cn(
        'block transition-all duration-200 hover:opacity-[0.92] active:scale-[0.98]',
        className
      )}
      aria-label="PrepDrift Home"
    >
      {actualVariant === 'icon' ? (
        <img 
          src={`${import.meta.env.BASE_URL}logo-full.png`}
          alt="PrepDrift" 
          className="w-12 h-12 object-contain"
        />
      ) : (
        <img 
          src={`${import.meta.env.BASE_URL}logo-symbol.png`}
          alt="PrepDrift" 
          className="h-[52px] w-auto object-contain object-left"
        />
      )}
    </Link>
  );
}
