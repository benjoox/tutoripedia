"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(() =>
    Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max], [value, defaultValue, min, max])

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}>
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          // Base styling with Japanese aesthetics
          "bg-muted relative grow overflow-hidden " +
          // Soft boundaries with gentle rounded corners
          "rounded-full " +
          // Engawa (transitional spaces) - slightly thicker track for better interaction
          "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full " +
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 " +
          // Smooth transitions
          "transition-all duration-250 ease-gentle " +
          // Subtle shadow for depth
          "shadow-xs"
        )}>
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            // Primary color with smooth transitions
            "bg-primary absolute " +
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full " +
            // Smooth transitions for range changes
            "transition-all duration-250 ease-gentle"
          )} />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            // Base styling with Japanese aesthetics - subtle and refined
            "block shrink-0 rounded-full " +
            // Proper sizing - elegant but accessible (18px visible, 44px touch target)
            "size-4.5 " +
            // Japanese-inspired styling - primary color instead of white background
            "bg-primary border-2 border-background " +
            // Soft shadow for depth without being overwhelming
            "shadow-sm " +
            // Smooth transitions for Seijaku (tranquility)
            "transition-all duration-250 ease-gentle " +
            // Hover states with subtle interactions
            "hover:shadow-md hover:scale-110 " +
            "hover:ring-2 hover:ring-primary/20 " +
            // Focus states with Japanese-inspired styling
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
            "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-hidden " +
            "focus-visible:shadow-md focus-visible:scale-110 " +
            // Active states
            "active:scale-105 active:shadow-sm " +
            // Disabled states
            "disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 " +
            "disabled:hover:shadow-sm " +
            // Ensure 44px touch target with invisible padding
            "relative before:content-[''] before:absolute before:inset-0 " +
            "before:scale-[2.44] before:rounded-full before:bg-transparent"
          )} />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider }
