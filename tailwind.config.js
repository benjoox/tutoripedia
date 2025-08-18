/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Japanese-inspired color palette
      colors: {
        // Primary colors - inspired by natural elements (sumi - charcoal)
        primary: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
          DEFAULT: '#2D3748',
          foreground: '#F7FAFC',
        },
        
        // Secondary colors - earth tones (hai-iro - ash gray)
        secondary: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          DEFAULT: '#E2E8F0',
          foreground: '#2D3748',
        },
        
        // Accent colors - subtle and refined (ai-iro - indigo blue) with improved contrast
        accent: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2B77CB',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
          DEFAULT: '#2B77CB',
          foreground: '#FFFFFF',
        },
        
        // Neutral colors - natural palette
        neutral: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        
        // Semantic colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',
        warning: 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',
        info: 'var(--info)',
        'info-foreground': 'var(--info-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      
      // Japanese-inspired typography system
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ],
      },
      
      // Typography scale with harmonious proportions
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.375', letterSpacing: '0.01em' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],            // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],    // 60px
      },
      
      // Line heights for optimal readability
      lineHeight: {
        'tight': '1.25',
        'snug': '1.375', 
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      
      // Letter spacing for Japanese aesthetics
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Harmonious spacing scale based on 8px grid
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '6.5': '1.625rem',  // 26px
        '7.5': '1.875rem',  // 30px
        '8.5': '2.125rem',  // 34px
        '9.5': '2.375rem',  // 38px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
      },
      
      // Subtle border radius for Japanese aesthetics
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        // Wabi-sabi inspired asymmetric border radius
        'wabi-subtle': '0.5rem 0.6rem 0.4rem 0.55rem',
        'wabi-gentle': '0.75rem 0.9rem 0.6rem 0.8rem',
        'wabi-card': '0.75rem 0.85rem 0.65rem 0.8rem',
        'wabi-button': '0.5rem 0.55rem 0.45rem 0.52rem',
      },
      
      // Soft, natural shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // Japanese-inspired soft shadows
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'gentle': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'calm': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        // Wabi-sabi inspired natural shadows with subtle irregularity
        'wabi-soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        'wabi-gentle': '0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'wabi-elevated': '0 8px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      
      // Animation timing for Seijaku (tranquility) - gentle, natural easing
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',           // Gentle ease-out
        'soft': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',     // Soft, natural curve
        'calm': 'cubic-bezier(0.23, 1, 0.32, 1)',           // Calm, restful easing
        'serene': 'cubic-bezier(0.16, 1, 0.3, 1)',          // Serene, flowing motion
        'peaceful': 'cubic-bezier(0.19, 1, 0.22, 1)',       // Peaceful, smooth transition
        'tranquil': 'cubic-bezier(0.25, 0.1, 0.25, 1)',     // Tranquil, balanced motion
        'zen': 'cubic-bezier(0.645, 0.045, 0.355, 1)',      // Zen-like, mindful easing
      },
      
      // Animation durations for different interaction types
      transitionDuration: {
        '150': '150ms',   // Quick micro-interactions
        '200': '200ms',   // Fast hover states
        '250': '250ms',   // Standard transitions
        '300': '300ms',   // Gentle state changes
        '350': '350ms',   // Calm transitions
        '400': '400ms',   // Peaceful animations
        '500': '500ms',   // Slow, meditative changes
        '600': '600ms',   // Very slow, contemplative
        '800': '800ms',   // Ultra-slow for special effects
        '1000': '1000ms', // Extremely slow, zen-like
      },
      
      // Animation delays for staggered effects
      transitionDelay: {
        '50': '50ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      // Keyframe animations for Seijaku (tranquility)
      keyframes: {
        // Gentle fade in/out
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // Soft slide animations
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Gentle scale animations
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        
        // Breathing animation for subtle life
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
        
        // Gentle pulse for focus states
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        
        // Soft glow effect
        'glow-soft': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(66, 153, 225, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(66, 153, 225, 0.4)' },
        },
        
        // Zen-like floating animation
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        
        // Subtle shimmer effect
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        
        // Gentle rotation for loading states
        'spin-gentle': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        // Wabi-sabi inspired irregular pulse
        'pulse-wabi': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '33%': { transform: 'scale(1.01)', opacity: '0.95' },
          '66%': { transform: 'scale(1.02)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Animation utilities
      animation: {
        // Fade animations
        'fade-in': 'fade-in 300ms ease-calm forwards',
        'fade-out': 'fade-out 300ms ease-calm forwards',
        
        // Slide animations
        'slide-in-up': 'slide-in-up 400ms ease-serene forwards',
        'slide-in-down': 'slide-in-down 400ms ease-serene forwards',
        'slide-in-left': 'slide-in-left 400ms ease-serene forwards',
        'slide-in-right': 'slide-in-right 400ms ease-serene forwards',
        
        // Scale animations
        'scale-in': 'scale-in 300ms ease-peaceful forwards',
        'scale-out': 'scale-out 300ms ease-peaceful forwards',
        
        // Continuous animations
        'breathe': 'breathe 4s ease-tranquil infinite',
        'pulse-gentle': 'pulse-gentle 2s ease-calm infinite',
        'glow-soft': 'glow-soft 3s ease-serene infinite',
        'float': 'float 6s ease-zen infinite',
        'shimmer': 'shimmer 2s ease-gentle infinite',
        'spin-gentle': 'spin-gentle 2s ease-calm infinite',
        'pulse-wabi': 'pulse-wabi 5s ease-soft infinite',
        
        // Quick micro-interactions
        'fade-in-fast': 'fade-in 150ms ease-gentle forwards',
        'scale-in-fast': 'scale-in 200ms ease-soft forwards',
        
        // Slow, meditative animations
        'fade-in-slow': 'fade-in 600ms ease-zen forwards',
        'scale-in-slow': 'scale-in 800ms ease-tranquil forwards',
      },
    },
  },
  plugins: [],
}