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
        // Typography with Japanese aesthetics
        "leading-relaxed tracking-wide text-foreground " +
        // Gentle transitions
        "transition-colors duration-250 ease-gentle " +
        // Disabled states
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " +
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " +
        // Required indicator styling
        "[&[data-required]]:after:content-['*'] [&[data-required]]:after:text-destructive " +
        "[&[data-required]]:after:ml-1 [&[data-required]]:after:text-sm",
        className
      )}
      {...props} />
  );
}

export { Label }
