import React from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import useScrollHeader from '@/hooks/useScrollHeader';

/**
 * Base Header component with collapse functionality
 * @param {Object} props
 * @param {string} props.title - Main title to display
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {boolean} props.isCollapsed - Whether header is in collapsed state
 * @param {boolean} [props.isSticky] - Whether header should be sticky
 * @param {Function} [props.onBackClick] - Callback for back button click
 * @param {string} [props.className] - Additional CSS classes
 */
function BaseHeader({ 
  title, 
  subtitle, 
  isCollapsed = false, 
  isSticky = false,
  onBackClick, 
  className 
}) {
  return (
    <header 
      className={cn(
        // Base styles with smooth transitions
        "w-full bg-background/95 backdrop-blur-sm border-b border-border/50",
        "transition-all duration-300 ease-in-out",
        // Sticky positioning when needed
        isSticky && "sticky top-0 z-50",
        // Collapsed state - minimal height
        isCollapsed ? "h-14" : "h-20",
        className
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center h-full">
          {/* Back button - always visible when onBackClick is provided */}
          {onBackClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className={cn(
                "mr-3 transition-all duration-300",
                isCollapsed ? "size-8" : "size-10"
              )}
              aria-label="Go back"
            >
              <IconArrowLeft className={cn(
                "transition-all duration-300",
                isCollapsed ? "size-4" : "size-5"
              )} />
            </Button>
          )}

          {/* Title and subtitle container */}
          <div className="flex-1 min-w-0">
            {/* Main title */}
            <h1 className={cn(
              "font-semibold text-foreground truncate transition-all duration-300",
              isCollapsed ? "text-lg leading-tight" : "text-xl leading-relaxed"
            )}>
              {title}
            </h1>
            
            {/* Subtitle - hidden when collapsed */}
            {subtitle && (
              <p className={cn(
                "text-muted-foreground truncate transition-all duration-300",
                isCollapsed 
                  ? "opacity-0 h-0 overflow-hidden text-xs" 
                  : "opacity-100 h-auto text-sm mt-1"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Header component with automatic scroll-based behavior
 * @param {Object} props
 * @param {string} props.title - Main title to display
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {Function} [props.onBackClick] - Callback for back button click
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.scrollOptions] - Options for scroll behavior
 * @param {number} [props.scrollOptions.threshold] - Scroll threshold for sticky behavior
 * @param {number} [props.scrollOptions.collapseDistance] - Distance to trigger collapse
 * @param {number} [props.scrollOptions.debounceMs] - Debounce delay for scroll events
 */
function Header({ 
  title, 
  subtitle, 
  onBackClick, 
  className,
  scrollOptions = {}
}) {
  const { isCollapsed, isSticky } = useScrollHeader(scrollOptions);

  return (
    <BaseHeader
      title={title}
      subtitle={subtitle}
      isCollapsed={isCollapsed}
      isSticky={isSticky}
      onBackClick={onBackClick}
      className={className}
    />
  );
}

// Export both components for flexibility
export { BaseHeader };
export default Header;