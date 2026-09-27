export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#FAFAFA', // slightly cooler light grey
          raised: '#FFFFFF',
          subtle: '#F4F4F5',
          border: '#E4E4E7',
          'border-strong': '#D4D4D8',
        },
        sidebar: {
          base: '#09090B',
          hover: '#18181B',
          active: '#27272A',
          border: '#27272A',
          text: '#FAFAFA',
          muted: '#A1A1AA',
        },
        text: {
          primary: '#09090B',
          secondary: '#71717A',
          tertiary: '#A1A1AA',
          inverse: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#3B82F6', // move from indigo to a sharper, tech blue
          light: '#DBEAFE',
          muted: '#93C5FD',
          hover: '#2563EB',
          subtle: '#EFF6FF',
        },
        status: {
          healthy: '#10B981',
          'healthy-bg': '#ECFDF5',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          critical: '#EF4444',
          'critical-bg': '#FEF2F2',
          neutral: '#71717A',
          'neutral-bg': '#F4F4F5',
        },
        drift: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'heading': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'subheading': ['0.9375rem', { lineHeight: '1.375rem', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        'metric': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em', fontWeight: '700' }],
        'metric-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.04em', fontWeight: '700' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        'sidebar': '260px',
        'sidebar-collapsed': '72px',
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
        'pill': '100px',
        'button': '10px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-elevated': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'glass': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'button-hover': '0 2px 6px rgba(0, 0, 0, 0.08)',
        'sidebar': '1px 0 0 0 #E8E8E4',
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
