import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Parameter control component for sliders and inputs
 */
function ParameterControl({ parameter, value, onChange, isMobile = false }) {
  const { key, label, type, min, max, step, unit, formatter, description } = parameter;

  const handleSliderChange = (newValue) => {
    onChange(key, newValue[0]);
  };

  const handleInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(key, newValue);
    }
  };

  const displayValue = formatter ? formatter(value) : `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={key} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-sm text-muted-foreground font-mono">
          {displayValue}
        </span>
      </div>
      
      {type === 'slider' && (
        <div className="space-y-2">
          <Slider
            id={key}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={handleSliderChange}
            className={cn(
              "w-full",
              // Enhanced touch targets for mobile
              isMobile && "[&_[role=slider]]:h-6 [&_[role=slider]]:w-6",
              isMobile && "[&_.slider-track]:h-2",
              isMobile && "touch-manipulation"
            )}
          />
          {(min !== undefined && max !== undefined) && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{min}{unit ? ` ${unit}` : ''}</span>
              <span>{max}{unit ? ` ${unit}` : ''}</span>
            </div>
          )}
        </div>
      )}
      
      {type === 'input' && (
        <Input
          id={key}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full",
            // Enhanced touch targets for mobile
            isMobile && "h-12 text-base",
            "touch-manipulation"
          )}
        />
      )}
      
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Current values display section
 */
function CurrentValuesSection({ calculations }) {
  if (!calculations || Object.keys(calculations).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Current Values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(calculations).map(([key, value]) => {
          // Format the key for display (convert camelCase to readable text)
          const displayKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          
          // Format the value
          let displayValue = value;
          if (typeof value === 'number') {
            displayValue = value.toFixed(4);
          }
          
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{displayKey}</span>
              <span className="text-sm font-mono">{displayValue}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Custom hook for handling touch gestures on mobile sidebar
 */
function useSidebarGestures(isOpen, onClose, sidebarRef) {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (!isMobile || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    let startX = 0;
    let currentX = 0;
    let initialOffset = 0;

    const handleTouchStart = (e) => {
      if (!isOpen) return;
      
      startX = e.touches[0].clientX;
      currentX = startX;
      initialOffset = 0;
      setIsDragging(true);
      setDragStartX(startX);
      setDragCurrentX(currentX);
      setDragOffset(0);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !isOpen) return;
      
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // Only allow dragging to the left (closing direction)
      if (deltaX < 0) {
        const offset = Math.max(deltaX, -320); // Max drag distance
        setDragCurrentX(currentX);
        setDragOffset(offset);
        
        // Apply transform during drag
        sidebar.style.transform = `translateX(${offset}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging || !isOpen) return;
      
      const deltaX = dragCurrentX - dragStartX;
      const threshold = -80; // Threshold for closing
      
      // Reset transform
      sidebar.style.transform = '';
      
      if (deltaX < threshold) {
        // Close sidebar if dragged far enough
        onClose?.();
      }
      
      setIsDragging(false);
      setDragStartX(0);
      setDragCurrentX(0);
      setDragOffset(0);
    };

    sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
    sidebar.addEventListener('touchmove', handleTouchMove, { passive: true });
    sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isOpen, onClose, isDragging, dragStartX, dragCurrentX]);

  return { isDragging, dragOffset };
}

/**
 * Sidebar component with parameter controls
 * @param {Object} props
 * @param {Array} props.parameters - Array of parameter definitions
 * @param {Object} props.values - Current parameter values
 * @param {Function} props.onChange - Callback for parameter changes
 * @param {Object} props.calculations - Current calculation results
 * @param {boolean} [props.isOpen] - Whether sidebar is open (for mobile)
 * @param {Function} [props.onClose] - Callback to close sidebar (for mobile)
 * @param {string} [props.className] - Additional CSS classes
 */
function Sidebar({ 
  parameters = [], 
  values = {}, 
  onChange, 
  calculations = {},
  isOpen = true,
  onClose,
  className 
}) {
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  const { isDragging, dragOffset } = useSidebarGestures(isOpen, onClose, sidebarRef);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isOpen, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (!isMobile) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className={cn(
            "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          // Base styles
          "bg-background h-full",
          // Desktop: normal flow sidebar (no border since parent handles it)
          "lg:relative lg:w-full lg:shadow-none lg:z-auto lg:border-r-0",
          // Mobile: fixed drawer behavior with enhanced animations
          isMobile && "fixed left-0 top-0 w-80 z-50 shadow-2xl border-r border-border/50",
          isMobile && "transition-all duration-300 ease-out",
          // Mobile transform states
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          // Dragging state
          isDragging && "transition-none",
          className
        )}
        role={isMobile ? "dialog" : "complementary"}
        aria-label="Tutorial parameters"
        aria-modal={isMobile ? isOpen : undefined}
      >
        <div className="h-full flex flex-col">
          {/* Header - only show on mobile or when not in desktop layout */}
          {isMobile && (
            <div className="p-4 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Parameters</h2>
                {/* Close button for mobile */}
                {onClose && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "p-2 hover:bg-accent/10 rounded-md transition-colors",
                      "touch-manipulation", // Better touch handling
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    )}
                    aria-label="Close parameters panel"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Drag indicator for mobile */}
              <div className="flex justify-center mt-2">
                <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
            </div>
          )}
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 lg:p-6 space-y-6">
              {/* Parameter controls */}
              {parameters.length > 0 && (
                <div className="space-y-6">
                  {parameters.map((parameter) => (
                    <ParameterControl
                      key={parameter.key}
                      parameter={parameter}
                      value={values[parameter.key] || 0}
                      onChange={onChange}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}
              
              {/* Current values display */}
              <CurrentValuesSection calculations={calculations} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;