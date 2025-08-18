import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        // Engawa (transitional spaces) - soft boundaries between items
        "border-b border-border/30 last:border-b-0 " +
        // Seijaku (tranquility) - gentle transitions
        "seijaku-transition-colors " +
        // Hover state with subtle interaction
        "hover:border-border/50",
        className
      )}
      {...props} />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Base layout and typography with Japanese aesthetics
          "flex flex-1 items-start justify-between gap-4 text-left text-sm font-medium outline-none " +
          // Ma (negative space) - generous padding and minimum touch targets
          "py-4 px-2 min-h-[44px] " +
          // Wabi-sabi natural boundaries
          "rounded-wabi-subtle " +
          // Typography with Japanese principles
          "leading-normal tracking-[0.01em] " +
          // Seijaku (tranquility) - gentle transitions
          "seijaku-transition seijaku-interactive " +
          // Hover states with subtle interactions
          "hover:text-foreground/90 hover:bg-accent/5 " +
          // Focus states with Japanese-inspired styling
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
          "focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:bg-accent/5 " +
          // Disabled states
          "disabled:pointer-events-none disabled:opacity-50 " +
          // Icon rotation animation with Seijaku easing
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}>
        {children}
        <IconChevronDown
          className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-350 ease-serene" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        // Seijaku (tranquility) - gentle slide animations
        "data-[state=closed]:animate-slide-out-up data-[state=open]:animate-slide-in-down " +
        "overflow-hidden " +
        // Typography with Japanese principles
        "text-sm leading-relaxed tracking-[0.01em] " +
        // Smooth transitions
        "seijaku-transition-opacity"
      )}
      {...props}>
      <div className={cn(
        // Ma (negative space) - generous spacing
        "pt-0 pb-6 px-2 " +
        // Seijaku entrance animation
        "seijaku-enter",
        className
      )}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
