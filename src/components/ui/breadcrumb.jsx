import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { IconChevronRight, IconDots } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function Breadcrumb({
  ...props
}) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({
  className,
  ...props
}) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        // Base styling with Japanese typography
        "text-muted-foreground flex flex-wrap items-center text-sm break-words " +
        // Engawa (transitional spaces) - generous spacing between breadcrumb items
        "gap-3 sm:gap-4 " +
        // Smooth transitions for navigation flow
        "transition-all duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function BreadcrumbItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        // Base layout
        "inline-flex items-center " +
        // Engawa (transitional spaces) - generous spacing within items
        "gap-2 " +
        // Minimum touch targets for accessibility
        "min-h-[44px] " +
        // Smooth transitions
        "transition-all duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        // Base styling
        "inline-flex items-center " +
        // Engawa (transitional spaces) - generous padding for touch targets
        "px-2 py-1 min-h-[44px] " +
        // Soft boundaries with gentle rounded corners
        "rounded-md " +
        // Smooth transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Hover states with subtle interactions
        "hover:text-foreground hover:bg-accent/5 hover:shadow-xs " +
        // Focus states with Japanese-inspired styling
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
        "focus-visible:ring-2 focus-visible:ring-ring/20",
        className
      )}
      {...props} />
  );
}

function BreadcrumbPage({
  className,
  ...props
}) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props} />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        // Icon sizing with Japanese aesthetics
        "[&>svg]:size-4 " +
        // Soft color for subtle separation
        "text-muted-foreground/60 " +
        // Smooth transitions
        "transition-all duration-250 ease-gentle",
        className
      )}
      {...props}>
      {children ?? <IconChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}>
      <IconDots className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
