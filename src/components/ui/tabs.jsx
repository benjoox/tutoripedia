"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        // Engawa (transitional spaces) - generous spacing between elements
        "flex flex-col gap-6 " +
        // Smooth transitions for Japanese aesthetics
        "transition-all duration-350 ease-calm",
        className
      )}
      {...props} />
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // Base styling with Japanese aesthetics
        "bg-muted text-muted-foreground inline-flex w-fit items-center justify-center " +
        // Engawa (transitional spaces) - generous padding and minimum touch targets
        "h-12 min-h-[44px] p-2 gap-1 " +
        // Wabi-sabi natural boundaries with subtle asymmetry
        "rounded-wabi-gentle wabi-sabi-texture " +
        // Smooth transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Natural shadow with subtle irregularity
        "shadow-wabi-soft " +
        // Hover states with natural interactions
        "hover:shadow-wabi-gentle hover:bg-muted/80",
        className
      )}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base layout and typography with Japanese aesthetics
        "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap " +
        "text-sm font-medium text-foreground dark:text-muted-foreground " +
        // Typography with Japanese principles
        "leading-normal tracking-[0.01em] " +
        // Engawa (transitional spaces) - generous padding and minimum touch targets
        "h-10 min-h-[44px] px-4 py-2.5 " +
        // Wabi-sabi natural boundaries with subtle asymmetry
        "rounded-wabi-subtle border border-transparent " +
        // Smooth transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Active state with Wabi-sabi natural styling
        "data-[state=active]:bg-background data-[state=active]:text-foreground " +
        "data-[state=active]:shadow-wabi-soft data-[state=active]:border-border/30 " +
        "data-[state=active]:-translate-y-0.5 " +
        "dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input " +
        // Hover states with natural interactions
        "hover:bg-background/50 hover:text-foreground hover:shadow-wabi-soft " +
        "hover:-translate-y-0.5 " +
        // Focus states with Japanese aesthetics
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
        "focus-visible:ring-2 focus-visible:ring-ring/20 " +
        // Disabled states
        "disabled:pointer-events-none disabled:opacity-50 " +
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        // Base layout
        "flex-1 outline-none " +
        // Engawa (transitional spaces) - generous spacing for content
        "mt-6 " +
        // Smooth transitions for content changes
        "transition-all duration-350 ease-calm " +
        // Seijaku (tranquility) - gentle content transitions
        "data-[state=active]:animate-fade-in data-[state=active]:animate-slide-in-up " +
        "data-[state=inactive]:animate-fade-out " +
        // Entrance animation with stagger
        "seijaku-enter",
        className
      )}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
