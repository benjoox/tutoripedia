import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base styling with Japanese aesthetics
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 " +
  // Icon styling and spacing
  "[&>svg]:size-3 gap-1 [&>svg]:pointer-events-none [&>svg]:shrink-0 " +
  // Focus and accessibility states
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
  // Gentle transitions for Seijaku (tranquility)
  "transition-all duration-250 ease-gentle overflow-hidden " +
  // Typography with Japanese principles
  "tracking-wide leading-tight",
  {
    variants: {
      variant: {
        // Default variant with Sumi (charcoal) inspiration
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs " +
          "[a&]:hover:bg-primary/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs",
        
        // Secondary variant with Hai-iro (ash gray) inspiration
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-xs " +
          "[a&]:hover:bg-secondary/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs",
        
        // Destructive variant with refined error styling
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs " +
          "[a&]:hover:bg-destructive/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs " +
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        
        // Success variant with Midori (green) inspiration
        success:
          "border-transparent bg-success text-success-foreground shadow-xs " +
          "[a&]:hover:bg-success/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs " +
          "focus-visible:ring-success/20",
        
        // Warning variant with Daidai-iro (orange) inspiration
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-xs " +
          "[a&]:hover:bg-warning/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs " +
          "focus-visible:ring-warning/20",
        
        // Info variant with Ai-iro (blue) inspiration
        info:
          "border-transparent bg-info text-info-foreground shadow-xs " +
          "[a&]:hover:bg-info/90 [a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:shadow-xs " +
          "focus-visible:ring-info/20",
        
        // Outline variant with Engawa (transitional spaces) styling
        outline:
          "text-foreground border-border/60 bg-transparent shadow-xs " +
          "[a&]:hover:bg-accent/10 [a&]:hover:text-accent-foreground [a&]:hover:border-accent/30 " +
          "[a&]:hover:shadow-soft [a&]:hover:-translate-y-0.5 " +
          "[a&]:active:translate-y-0 [a&]:active:bg-accent/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
