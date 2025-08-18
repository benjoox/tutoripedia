import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        // Base layout
        "group flex flex-1 list-none items-center justify-center " +
        // Engawa (transitional spaces) - generous spacing between navigation items
        "gap-3 " +
        // Smooth transitions for navigation flow
        "transition-all duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function NavigationMenuItem({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props} />
  );
}

const navigationMenuTriggerStyle = cva(
  // Base styling with Japanese aesthetics
  "group inline-flex w-max items-center justify-center bg-background text-sm font-medium " +
  // Engawa (transitional spaces) - generous padding and minimum touch targets
  "h-11 min-h-[44px] px-6 py-3 gap-2 " +
  // Soft boundaries with gentle rounded corners
  "rounded-lg " +
  // Smooth transitions for Seijaku (tranquility)
  "transition-all duration-250 ease-gentle " +
  // Hover states with subtle interactions
  "hover:bg-accent/10 hover:text-accent-foreground hover:shadow-xs hover:-translate-y-0.5 " +
  // Focus states with Japanese-inspired styling
  "focus:bg-accent/10 focus:text-accent-foreground focus:shadow-soft " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "focus-visible:ring-2 focus-visible:ring-ring/20 " +
  // Open states with enhanced styling
  "data-[state=open]:bg-accent/15 data-[state=open]:text-accent-foreground " +
  "data-[state=open]:shadow-soft data-[state=open]:-translate-y-0.5 " +
  "data-[state=open]:hover:bg-accent/20 data-[state=open]:focus:bg-accent/20 " +
  // Disabled states
  "disabled:pointer-events-none disabled:opacity-50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}>
      {children}{" "}
      <IconChevronDown
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props} />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}) {
  return (
    <div
      className={cn("absolute top-full left-0 isolate z-50 flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props} />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        // Base layout and typography
        "flex flex-col text-sm outline-none " +
        // Engawa (transitional spaces) - generous spacing and minimum touch targets
        "gap-2 p-4 min-h-[44px] " +
        // Soft boundaries with gentle rounded corners
        "rounded-lg " +
        // Smooth transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle " +
        // Hover states with subtle interactions
        "hover:bg-accent/10 hover:text-accent-foreground hover:shadow-xs hover:-translate-y-0.5 " +
        // Focus states with Japanese-inspired styling
        "focus:bg-accent/10 focus:text-accent-foreground focus:shadow-soft " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
        "focus-visible:ring-2 focus-visible:ring-ring/20 " +
        // Active states with enhanced styling
        "data-[active=true]:bg-accent/15 data-[active=true]:text-accent-foreground " +
        "data-[active=true]:shadow-soft data-[active=true]:-translate-y-0.5 " +
        "data-[active=true]:hover:bg-accent/20 data-[active=true]:focus:bg-accent/20 " +
        // Icon styling
        "[&_svg:not([class*='text-'])]:text-muted-foreground " +
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}>
      <div
        className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
