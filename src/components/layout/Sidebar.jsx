import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Parameter control component for sliders and inputs
 */
function ParameterControl({ parameter, value, onChange }) {
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
            className="w-full"
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
          className="w-full"
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
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        // Base styles
        "bg-background border-r border-border/50",
        // Desktop: fixed sidebar
        "lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-80 lg:translate-x-0",
        // Mobile: drawer behavior
        "fixed left-0 top-0 h-full w-80 z-50 transition-transform duration-300 ease-in-out lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Parameters</h2>
              {/* Close button for mobile */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-accent/10 rounded-md"
                  aria-label="Close sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Parameter controls */}
              {parameters.length > 0 && (
                <div className="space-y-6">
                  {parameters.map((parameter) => (
                    <ParameterControl
                      key={parameter.key}
                      parameter={parameter}
                      value={values[parameter.key] || 0}
                      onChange={onChange}
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