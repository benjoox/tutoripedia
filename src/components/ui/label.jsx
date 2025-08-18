"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Base styling with Japanese typography principles
        "flex items-center text-sm font-medium select-none " +
        // Ma (negative space) - breathing room between elements
        "gap-2 mb-2 " +
        // Typography with Japanese aesthetics - improved readability
        "leading-normal tracking-wide text-foreground " +
        // Letter spacing for better character recognition
        "tracking-[0.025em] " +
        // Gentle transitions
        "transition-colors duration-250 ease-gentle " +
        // Disabled states
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " +
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " +
        // Required indicator styling with better spacing
        "[&[data-required]]:after:content-['*'] [&[data-required]]:after:text-destructive " +
        "[&[data-required]]:after:ml-1.5 [&[data-required]]:after:text-sm [&[data-required]]:after:font-medium",
        className
      )}
      {...props} />
  );
}

export { Label }
