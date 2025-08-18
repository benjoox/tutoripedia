import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with Japanese design principles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 " +
  // Typography with Japanese aesthetics
  "tracking-wide leading-normal " +
  // Shibui (subtle beauty) - gentle transitions and refined interactions
  "transition-all duration-250 ease-gentle " +
  // Ma (negative space) - generous spacing for breathing room
  "min-h-[44px] min-w-[44px] " +
  // Accessibility with Japanese-inspired focus states
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 " +
  // Error states with subtle styling
  "aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/50",
  {
    variants: {
      variant: {
        // Primary - Sumi (charcoal) inspired with Wabi-sabi imperfections
        default:
          "bg-primary text-primary-foreground rounded-wabi-button shadow-wabi-soft " +
          "hover:bg-primary/90 hover:shadow-wabi-gentle hover:-translate-y-0.5 " +
          "active:translate-y-0 active:shadow-xs " +
          "dark:bg-primary dark:hover:bg-primary/80",
        
        // Destructive - refined error styling
        destructive:
          "bg-destructive text-destructive-foreground rounded-lg shadow-soft " +
          "hover:bg-destructive/90 hover:shadow-gentle hover:-translate-y-0.5 " +
          "active:translate-y-0 active:shadow-xs " +
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/30",
        
        // Outline - Engawa (transitional spaces) with Wabi-sabi natural boundaries
        outline:
          "border border-border bg-background text-foreground rounded-wabi-button shadow-xs " +
          "hover:bg-accent/5 hover:border-accent/20 hover:shadow-wabi-soft " +
          "hover:text-foreground hover:-translate-y-0.5 " +
          "active:translate-y-0 active:bg-accent/10 active:text-foreground " +
          "dark:bg-background/50 dark:border-border dark:hover:bg-accent/10 dark:hover:text-foreground",
        
        // Secondary - Hai-iro (ash gray) inspired with natural imperfections
        secondary:
          "bg-secondary text-secondary-foreground rounded-wabi-button shadow-wabi-soft " +
          "hover:bg-secondary/80 hover:shadow-wabi-gentle hover:-translate-y-0.5 " +
          "active:translate-y-0 active:shadow-xs " +
          "dark:bg-secondary/20 dark:hover:bg-secondary/30",
        
        // Ghost - minimal with Kanso (simplicity) principles
        ghost:
          "text-foreground rounded-lg hover:bg-accent/10 hover:text-foreground " +
          "hover:shadow-xs hover:-translate-y-0.5 " +
          "active:translate-y-0 active:bg-accent/15 active:text-foreground " +
          "dark:hover:bg-accent/10 dark:hover:text-foreground",
        
        // Link - understated with subtle interactions
        link: 
          "text-accent underline-offset-4 rounded-sm " +
          "hover:underline hover:text-accent/80 " +
          "focus-visible:underline focus-visible:bg-accent/5 " +
          "active:text-accent/70",
      },
      size: {
        // Default size with Ma (negative space) principles
        default: "h-10 px-6 py-2.5 text-sm tracking-[0.01em] has-[>svg]:px-4",
        
        // Small size maintaining minimum touch targets
        sm: "h-9 px-4 py-2 text-sm tracking-[0.025em] rounded-md gap-1.5 has-[>svg]:px-3",
        
        // Large size with generous spacing
        lg: "h-12 px-8 py-3 text-base tracking-[0.005em] rounded-xl has-[>svg]:px-6",
        
        // Icon size ensuring 44px minimum for accessibility
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
