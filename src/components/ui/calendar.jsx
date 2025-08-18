import * as React from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Base padding with Ma (negative space) principles
        "p-4 " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle",
        className
      )}
      classNames={{
        // Month layout with generous spacing
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-5",
        
        // Caption styling with Japanese typography
        caption: "flex justify-center pt-2 relative items-center w-full mb-2",
        caption_label: "text-base font-medium tracking-wide text-foreground",
        
        // Navigation with subtle Japanese aesthetics
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "size-8 bg-transparent p-0 " +
          "text-muted-foreground/60 hover:text-foreground " +
          "hover:bg-accent/40 " +
          "rounded-wabi-subtle " +
          "transition-all duration-200 ease-gentle " +
          "shadow-xs hover:shadow-soft"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        
        // Table layout with proper spacing
        table: "w-full border-collapse mt-2",
        head_row: "flex mb-2",
        head_cell: cn(
          "text-muted-foreground/80 w-9 h-9 " +
          "font-medium text-xs tracking-wider uppercase " +
          "flex items-center justify-center " +
          "select-none"
        ),
        
        // Row and cell styling
        row: "flex w-full",
        cell: cn(
          "relative p-0 text-center text-sm " +
          "focus-within:relative focus-within:z-20 " +
          // Range selection styling with Wabi-sabi asymmetry
          "[&:has([aria-selected])]:bg-accent/30 " +
          "[&:has([aria-selected].day-range-end)]:rounded-r-wabi-subtle " +
          "[&:has([aria-selected].day-range-start)]:rounded-l-wabi-subtle",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-wabi-subtle " +
              "[&:has(>.day-range-start)]:rounded-l-wabi-subtle " +
              "first:[&:has([aria-selected])]:rounded-l-wabi-subtle " +
              "last:[&:has([aria-selected])]:rounded-r-wabi-subtle"
            : "[&:has([aria-selected])]:rounded-wabi-subtle"
        ),
        
        // Day button styling with Japanese aesthetics
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal " +
          "rounded-wabi-subtle " +
          "hover:bg-accent/40 hover:text-accent-foreground " +
          "transition-all duration-200 ease-gentle " +
          "aria-selected:opacity-100 " +
          "shadow-xs hover:shadow-soft"
        ),
        
        // Range selection states
        day_range_start: cn(
          "day-range-start " +
          "aria-selected:bg-primary/90 aria-selected:text-primary-foreground " +
          "aria-selected:shadow-soft " +
          "rounded-l-wabi-subtle"
        ),
        day_range_end: cn(
          "day-range-end " +
          "aria-selected:bg-primary/90 aria-selected:text-primary-foreground " +
          "aria-selected:shadow-soft " +
          "rounded-r-wabi-subtle"
        ),
        
        // Selected day styling
        day_selected: cn(
          "bg-primary/90 text-primary-foreground shadow-soft " +
          "hover:bg-primary hover:text-primary-foreground " +
          "focus:bg-primary focus:text-primary-foreground " +
          "rounded-wabi-subtle"
        ),
        
        // Today styling with accent color
        day_today: cn(
          "bg-accent/20 text-accent-foreground font-medium " +
          "border border-accent/30 " +
          "rounded-wabi-subtle"
        ),
        
        // Outside days with muted appearance
        day_outside: cn(
          "day-outside text-muted-foreground/50 " +
          "aria-selected:text-muted-foreground/70"
        ),
        
        // Disabled days
        day_disabled: "text-muted-foreground/30 opacity-50 cursor-not-allowed",
        
        // Range middle days
        day_range_middle: cn(
          "aria-selected:bg-accent/20 aria-selected:text-accent-foreground " +
          "rounded-none"
        ),
        
        // Hidden days
        day_hidden: "invisible",
        
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <IconChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <IconChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props} />
  );
}

export { Calendar }
