import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base styling with Japanese aesthetics
        "bg-card text-card-foreground flex flex-col " +
        // Ma (negative space) - generous spacing and breathing room
        "gap-6 p-6 " +
        // Wabi-sabi (imperfect beauty) - natural asymmetry and textures
        "rounded-wabi-card border border-border/50 shadow-wabi-soft wabi-sabi-texture " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Hover state with subtle elevation and natural shadow
        "hover:shadow-wabi-gentle hover:border-border/70 hover:-translate-y-0.5 " +
        // Dark mode considerations
        "dark:bg-card/50 dark:border-border/30 dark:hover:border-border/50",
        className
      )}
      {...props} />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Container and grid layout
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start " +
        // Ma (negative space) - generous spacing between elements
        "gap-2 " +
        // Action button layout
        "has-data-[slot=card-action]:grid-cols-[1fr_auto] " +
        // Border styling with Japanese aesthetics
        "[.border-b]:pb-6 [.border-b]:border-border/30",
        className
      )}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // Japanese typography hierarchy - clean and refined
        "text-lg font-semibold leading-snug tracking-tight " +
        // Subtle color for hierarchy
        "text-foreground " +
        // Smooth transitions
        "transition-colors duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        // Japanese typography - subtle and readable
        "text-sm text-muted-foreground leading-relaxed tracking-[0.01em] " +
        // Ma (negative space) - breathing room
        "mt-1 " +
        // Smooth transitions
        "transition-colors duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Ma (negative space) - no horizontal padding since Card already has padding
        // Vertical rhythm for content flow
        "space-y-4 " +
        // Typography improvements
        "text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Layout and alignment
        "flex items-center justify-between " +
        // Ma (negative space) - generous spacing
        "gap-4 " +
        // Border styling with Japanese aesthetics
        "[.border-t]:pt-6 [.border-t]:border-border/30 " +
        // Ensure minimum touch targets for interactive elements
        "[&_button]:min-h-[44px]",
        className
      )}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
