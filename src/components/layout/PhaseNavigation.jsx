import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Custom hook for handling swipe gestures on mobile
 */
function useSwipeGestures(onSwipeLeft, onSwipeRight, enabled = true) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    if (!enabled) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [enabled]);

  const onTouchMove = useCallback((e) => {
    if (!enabled) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [enabled]);

  const onTouchEnd = useCallback(() => {
    if (!enabled || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft?.();
    } else if (isRightSwipe) {
      onSwipeRight?.();
    }
  }, [enabled, touchStart, touchEnd, onSwipeLeft, onSwipeRight, minSwipeDistance]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

/**
 * Individual phase button component
 */
function PhaseButton({ phase, isActive, onClick, size = 'default', isMobile = false }) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size={size}
      onClick={() => onClick(phase.id)}
      className={cn(
        "transition-all duration-300 whitespace-nowrap touch-manipulation",
        isActive && "shadow-md",
        size === 'sm' && "text-xs px-3 py-2 h-8",
        // Enhanced touch targets for mobile
        isMobile && size === 'sm' && "h-10 px-4 text-sm",
        isMobile && "active:scale-95"
      )}
    >
      {phase.icon && (
        <span className={cn(
          "flex-shrink-0",
          size === 'sm' ? "mr-1.5" : "mr-2"
        )}>
          {phase.icon}
        </span>
      )}
      <span className="truncate">
        {size === 'sm' && phase.shortTitle ? phase.shortTitle : phase.title}
      </span>
    </Button>
  );
}

/**
 * Mobile horizontal scroll navigation with swipe gestures
 */
function MobilePhaseNavigation({ phases, currentPhase, onPhaseChange }) {
  const scrollContainerRef = useRef(null);
  const activeButtonRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle swipe gestures for phase switching
  const handleSwipeLeft = useCallback(() => {
    if (currentPhase < phases.length - 1) {
      onPhaseChange(currentPhase + 1);
    }
  }, [currentPhase, phases.length, onPhaseChange]);

  const handleSwipeRight = useCallback(() => {
    if (currentPhase > 0) {
      onPhaseChange(currentPhase - 1);
    }
  }, [currentPhase, onPhaseChange]);

  const swipeHandlers = useSwipeGestures(
    handleSwipeLeft,
    handleSwipeRight,
    !isScrolling // Disable swipe when scrolling
  );

  // Scroll active button into view
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeButtonRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
        button.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [currentPhase]);

  // Handle scroll state for swipe gesture detection
  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    // Debounce scroll end detection
    const timeoutId = setTimeout(() => setIsScrolling(false), 150);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="lg:hidden">
      {/* Swipe indicator */}
      <div className="flex justify-center mb-2">
        <div className="flex gap-1">
          {phases.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-1 rounded-full transition-all duration-300",
                index === currentPhase 
                  ? "bg-primary w-4" 
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Phase buttons with swipe support */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2 overscroll-x-contain"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory'
        }}
        {...swipeHandlers}
      >
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            ref={index === currentPhase ? activeButtonRef : null}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: 'center' }}
          >
            <PhaseButton
              phase={phase}
              isActive={index === currentPhase}
              onClick={() => onPhaseChange(index)}
              size="sm"
              isMobile={true}
            />
          </div>
        ))}
      </div>

      {/* Navigation hints */}
      {phases.length > 3 && (
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">
            Swipe or scroll to navigate phases
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Desktop phase navigation with scroll buttons
 */
function DesktopPhaseNavigation({ phases, currentPhase, onPhaseChange }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Check scroll state
  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState);
      return () => container.removeEventListener('scroll', checkScrollState);
    }
  }, [phases]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="hidden lg:flex items-center">
      {/* Left scroll button */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="mr-2 flex-shrink-0"
        >
          <IconChevronLeft className="size-4" />
        </Button>
      )}
      
      {/* Phase buttons container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {phases.map((phase, index) => (
          <PhaseButton
            key={phase.id}
            phase={phase}
            isActive={index === currentPhase}
            onClick={() => onPhaseChange(index)}
            isMobile={false}
          />
        ))}
      </div>
      
      {/* Right scroll button */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="ml-2 flex-shrink-0"
        >
          <IconChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * PhaseNavigation component with sticky behavior
 * @param {Object} props
 * @param {Array} props.phases - Array of phase objects
 * @param {number} props.currentPhase - Index of current active phase
 * @param {Function} props.onPhaseChange - Callback when phase changes
 * @param {boolean} [props.isSticky] - Whether navigation should be sticky
 * @param {string} [props.className] - Additional CSS classes
 */
function PhaseNavigation({ 
  phases = [], 
  currentPhase = 0, 
  onPhaseChange, 
  isSticky = false,
  className 
}) {
  if (!phases.length) {
    return null;
  }

  return (
    <nav className={cn(
      // Base styles
      "w-full bg-background/95 backdrop-blur-sm border-b border-border/50",
      "transition-all duration-300 ease-in-out",
      // Sticky behavior
      isSticky && "sticky top-0 z-30 shadow-sm",
      // Responsive padding
      "py-3 lg:py-4",
      className
    )}>
      <div className="container mx-auto">
        {/* Mobile navigation */}
        <MobilePhaseNavigation
          phases={phases}
          currentPhase={currentPhase}
          onPhaseChange={onPhaseChange}
        />
        
        {/* Desktop navigation */}
        <div className="hidden lg:block px-4">
          <DesktopPhaseNavigation
            phases={phases}
            currentPhase={currentPhase}
            onPhaseChange={onPhaseChange}
          />
        </div>
      </div>
    </nav>
  );
}

export default PhaseNavigation;