import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

/**
 * Progress indicator component
 */
function ProgressIndicator({ currentPhase, totalPhases }) {
  const progress = ((currentPhase + 1) / totalPhases) * 100;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Progress bar */}
      <div className="w-full max-w-xs bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress text */}
      <span className="text-sm text-muted-foreground">
        Phase {currentPhase + 1} of {totalPhases}
      </span>
    </div>
  );
}

/**
 * Navigation button component
 */
function NavigationButton({
  direction,
  onClick,
  disabled,
  phaseTitle,
  className
}) {
  const isNext = direction === 'next';
  const Icon = isNext ? IconChevronRight : IconChevronLeft;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {!isNext && <Icon className="size-4" />}
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">
          {isNext ? 'Next' : 'Previous'}
        </span>
        <span className="text-sm font-medium truncate max-w-32">
          {phaseTitle || (isNext ? 'Next Phase' : 'Previous Phase')}
        </span>
      </div>
      {isNext && <Icon className="size-4" />}
    </Button>
  );
}

/**
 * Footer component for tutorial navigation
 * @param {Object} props
 * @param {Array} props.phases - Array of phase objects
 * @param {number} props.currentPhase - Index of current active phase
 * @param {Function} props.onPhaseChange - Callback when phase changes
 * @param {Function} [props.onPrevious] - Custom callback for previous button
 * @param {Function} [props.onNext] - Custom callback for next button
 * @param {boolean} [props.showProgress] - Whether to show progress indicator
 * @param {string} [props.className] - Additional CSS classes
 */
function Footer({
  phases = [],
  currentPhase = 0,
  onPhaseChange,
  onPrevious,
  onNext,
  showProgress = true,
  className
}) {
  if (!phases.length) {
    return null;
  }

  const isFirstPhase = currentPhase === 0;
  const isLastPhase = currentPhase === phases.length - 1;

  const previousPhase = !isFirstPhase ? phases[currentPhase - 1] : null;
  const nextPhase = !isLastPhase ? phases[currentPhase + 1] : null;

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (onPhaseChange && !isFirstPhase) {
      onPhaseChange(currentPhase - 1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (onPhaseChange && !isLastPhase) {
      onPhaseChange(currentPhase + 1);
    }
  };

  return (
    <footer className={cn(
      // Base styles
      "w-full bg-background/95 backdrop-blur-sm border-t border-border/50",
      "transition-all duration-300 ease-in-out flex-shrink-0",
      className
    )}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Previous button */}
          <div className="flex-1 flex justify-start">
            <NavigationButton
              direction="previous"
              onClick={handlePrevious}
              disabled={isFirstPhase}
              phaseTitle={previousPhase?.title}
            />
          </div>

          {/* Progress indicator */}
          {showProgress && (
            <div className="flex-1 flex justify-center">
              <ProgressIndicator
                currentPhase={currentPhase}
                totalPhases={phases.length}
              />
            </div>
          )}

          {/* Next button */}
          <div className="flex-1 flex justify-end">
            <NavigationButton
              direction="next"
              onClick={handleNext}
              disabled={isLastPhase}
              phaseTitle={nextPhase?.title}
            />
          </div>
        </div>

        {/* Mobile layout - stacked */}
        <div className="md:hidden mt-4 space-y-4">
          {showProgress && (
            <div className="flex justify-center">
              <ProgressIndicator
                currentPhase={currentPhase}
                totalPhases={phases.length}
              />
            </div>
          )}

          <div className="flex justify-between gap-4">
            <NavigationButton
              direction="previous"
              onClick={handlePrevious}
              disabled={isFirstPhase}
              phaseTitle={previousPhase?.title}
              className="flex-1"
            />

            <NavigationButton
              direction="next"
              onClick={handleNext}
              disabled={isLastPhase}
              phaseTitle={nextPhase?.title}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;