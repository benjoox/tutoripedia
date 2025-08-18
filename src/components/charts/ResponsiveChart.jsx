import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Enhanced responsive chart wrapper with mobile optimizations
 */
function ResponsiveChart({ 
  children, 
  height = 400, 
  mobileHeight = 300,
  className,
  enablePinchZoom = false,
  enableTouch = true,
  ...props 
}) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '100%', height: isMobile ? mobileHeight : height });
  const [isInteracting, setIsInteracting] = useState(false);

  // Handle responsive height
  useEffect(() => {
    setDimensions(prev => ({
      ...prev,
      height: isMobile ? mobileHeight : height
    }));
  }, [isMobile, height, mobileHeight]);

  // Handle touch interactions for mobile
  useEffect(() => {
    if (!isMobile || !enableTouch || !containerRef.current) return;

    const container = containerRef.current;
    let touchStartTime = 0;
    let touchCount = 0;

    const handleTouchStart = (e) => {
      touchStartTime = Date.now();
      touchCount = e.touches.length;
      setIsInteracting(true);
      
      // Prevent scrolling when interacting with chart
      if (touchCount === 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      if (touchCount === 1 && enablePinchZoom) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Reset interaction state after a short delay
      setTimeout(() => setIsInteracting(false), 100);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, enableTouch, enablePinchZoom]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full",
        // Mobile optimizations
        isMobile && "touch-manipulation",
        isInteracting && "select-none",
        className
      )}
      style={{
        // Prevent text selection during touch interactions
        WebkitUserSelect: isInteracting ? 'none' : 'auto',
        userSelect: isInteracting ? 'none' : 'auto',
        // Improve touch responsiveness
        touchAction: enablePinchZoom ? 'pinch-zoom' : 'pan-y'
      }}
      {...props}
    >
      <ResponsiveContainer 
        width={dimensions.width} 
        height={dimensions.height}
        // Optimize for mobile performance
        debounce={isMobile ? 100 : 0}
      >
        {children}
      </ResponsiveContainer>
      
      {/* Mobile interaction hint */}
      {isMobile && enableTouch && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Tap to interact
        </div>
      )}
    </div>
  );
}

export default ResponsiveChart;