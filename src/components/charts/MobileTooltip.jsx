import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Mobile-optimized tooltip for charts
 */
function MobileTooltip({ 
  active, 
  payload, 
  label, 
  formatter,
  labelFormatter,
  className,
  ...props 
}) {
  const isMobile = useIsMobile();

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3",
        // Mobile optimizations
        isMobile && "text-sm max-w-xs",
        !isMobile && "text-xs",
        className
      )}
      style={{
        // Ensure tooltip is readable on mobile
        minWidth: isMobile ? '120px' : 'auto',
        fontSize: isMobile ? '14px' : '12px',
        lineHeight: isMobile ? '1.4' : '1.2'
      }}
      {...props}
    >
      {/* Label */}
      {label && (
        <div className={cn(
          "font-medium text-foreground mb-1",
          isMobile && "text-sm",
          !isMobile && "text-xs"
        )}>
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      
      {/* Payload items */}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const { color, name, value } = entry;
          const formattedValue = formatter ? formatter(value, name, entry, index) : value;
          
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground truncate">
                {name}:
              </span>
              <span className="font-medium text-foreground">
                {Array.isArray(formattedValue) ? formattedValue[0] : formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MobileTooltip;