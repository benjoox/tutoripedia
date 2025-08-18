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
      className={cn("border-b last:border-b-0", className)}
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
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none " +
          // Typography with Japanese principles
          "leading-normal tracking-[0.01em] " +
          // Gentle transitions for Seijaku (tranquility)
          "transition-all duration-250 ease-gentle " +
          // Hover states with subtle interactions
          "hover:underline hover:text-foreground/90 " +
          // Focus states with Japanese-inspired styling
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
          // Disabled states
          "disabled:pointer-events-none disabled:opacity-50 " +
          // Icon rotation animation
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}>
        {children}
        <IconChevronDown
          className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
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
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm leading-relaxed tracking-[0.01em]"
      {...props}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
