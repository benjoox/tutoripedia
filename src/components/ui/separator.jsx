"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  // Base styling with Japanese aesthetics - Engawa (transitional spaces)
  "shrink-0 " +
  // Gentle transitions for Seijaku (tranquility)
  "transition-colors duration-350 ease-gentle " +
  // Orientation-specific sizing
  "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full " +
  "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
  {
    variants: {
      variant: {
        // Default variant with subtle border - Ma (negative space) principle
        default: "bg-border/60",
        
        // Soft variant with even more subtle appearance
        soft: "bg-border/40",
        
        // Strong variant for more prominent separation
        strong: "bg-border/80",
        
        // Accent variant using the Japanese-inspired accent color
        accent: "bg-accent/20",
        
        // Gradient variant for Wabi-sabi inspired natural variation
        gradient: 
          "bg-gradient-to-r from-transparent via-border/60 to-transparent " +
          "data-[orientation=vertical]:bg-gradient-to-b " +
          "data-[orientation=vertical]:from-transparent " +
          "data-[orientation=vertical]:via-border/60 " +
          "data-[orientation=vertical]:to-transparent",
      },
      spacing: {
        // Spacing variants following Ma (negative space) principles
        none: "",
        sm: "data-[orientation=horizontal]:my-2 data-[orientation=vertical]:mx-2",
        md: "data-[orientation=horizontal]:my-4 data-[orientation=vertical]:mx-4",
        lg: "data-[orientation=horizontal]:my-6 data-[orientation=vertical]:mx-6",
        xl: "data-[orientation=horizontal]:my-8 data-[orientation=vertical]:mx-8",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "none",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant,
  spacing,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant, spacing }), className)}
      {...props} />
  );
}

export { Separator }
