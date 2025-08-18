import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styling with Japanese aesthetics
        "flex w-full bg-transparent text-base outline-none resize-none " +
        // Ma (negative space) - generous padding and spacing
        "min-h-20 px-4 py-3 " +
        // Shibui (subtle beauty) - refined borders and shadows
        "rounded-lg border border-border/60 shadow-xs " +
        // Field sizing for dynamic content
        "field-sizing-content " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Focus states with Japanese-inspired styling
        "focus:border-ring/70 focus:shadow-soft focus:ring-2 focus:ring-ring/10 " +
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 " +
        // Hover states
        "hover:border-border/80 hover:shadow-soft " +
        // Placeholder and selection styling
        "placeholder:text-muted-foreground/70 " +
        "selection:bg-accent/20 selection:text-accent-foreground " +
        // Typography with Japanese principles
        "leading-relaxed " +
        // Disabled states
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
        "disabled:bg-muted/30 disabled:border-border/30 " +
        // Error states with subtle styling
        "aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/10 " +
        "aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive/20 " +
        // Dark mode considerations
        "dark:bg-input/20 dark:border-border/40 dark:hover:border-border/60 " +
        "dark:focus:border-ring/60 dark:aria-invalid:border-destructive/50 " +
        // Responsive text sizing
        "md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }
