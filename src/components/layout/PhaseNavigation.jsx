import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Individual phase button component
 */
function PhaseButton({ phase, isActive, onClick, size = 'default' }) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size={size}
      onClick={() => onClick(phase.id)}
      className={cn(
        "transition-all duration-300 whitespace-nowrap",
        isActive && "shadow-md",
        size === 'sm' && "text-xs px-3 py-2 h-8"
      )}
    >
      {phase.icon && (
        <span className="mr-2 flex-shrink-0">
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
 * Mobile horizontal scroll navigation
 */
function MobilePhaseNavigation({ phases, currentPhase, onPhaseChange }) {
  const scrollContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

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

  return (
    <div className="lg:hidden">
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            ref={index === currentPhase ? activeButtonRef : null}
          >
            <PhaseButton
              phase={phase}
              isActive={index === currentPhase}
              onClick={() => onPhaseChange(index)}
              size="sm"
            />
          </div>
        ))}
      </div>
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
          <ChevronLeft className="size-4" />
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
          <ChevronRight className="size-4" />
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