"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { IconSearch } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        // Base styling with Japanese aesthetics
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden " +
        // Wabi-sabi inspired subtle asymmetry in border radius
        "rounded-wabi-card " +
        // Soft shadow for depth without harshness
        "shadow-wabi-gentle " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0 shadow-wabi-elevated">
        <Command
          className={cn(
            // Group heading styling with Japanese typography
            "[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 " +
            "[&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-medium " +
            "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:tracking-wide " +
            "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:letter-spacing-wider " +
            // Group styling with Ma (negative space) principles
            "[&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 " +
            // Input wrapper styling
            "[&_[cmdk-input-wrapper]]:h-14 [&_[cmdk-input-wrapper]_svg]:h-4 [&_[cmdk-input-wrapper]_svg]:w-4 " +
            // Input styling with generous spacing
            "[&_[cmdk-input]]:h-14 [&_[cmdk-input]]:text-base " +
            // Item styling with Ma (negative space) and gentle interactions
            "[&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 " +
            "[&_[cmdk-item]]:rounded-wabi-subtle [&_[cmdk-item]]:mx-1 [&_[cmdk-item]]:my-0.5"
          )}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        // Base layout with Ma (negative space) principles
        "flex h-14 items-center gap-3 border-b border-border/40 px-4 " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-colors duration-250 ease-gentle " +
        // Focus-within state for enhanced accessibility
        "focus-within:border-border/60"
      )}>
      <IconSearch className="size-4 shrink-0 text-muted-foreground/60 transition-colors duration-250 ease-gentle" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          // Base styling with Japanese aesthetics
          "flex h-12 w-full bg-transparent text-base " +
          // Typography with proper spacing
          "tracking-wide leading-relaxed " +
          // Placeholder styling
          "placeholder:text-muted-foreground/60 placeholder:tracking-wide " +
          // Focus and interaction states
          "outline-hidden focus:outline-none " +
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 " +
          // Gentle transitions
          "transition-all duration-250 ease-gentle",
          className
        )}
        {...props} />
    </div>
  );
}

function CommandList({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        // Scrollable area with Ma (negative space) principles
        "max-h-[320px] scroll-py-2 overflow-x-hidden overflow-y-auto " +
        // Padding for breathing room
        "py-2 " +
        // Custom scrollbar styling for Japanese aesthetics
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/40 " +
        "hover:scrollbar-thumb-border/60",
        className
      )}
      {...props} />
  );
}

function CommandEmpty({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Empty 
      data-slot="command-empty" 
      className={cn(
        // Generous spacing following Ma (negative space) principles
        "py-8 px-4 text-center " +
        // Typography with Japanese aesthetics
        "text-sm text-muted-foreground/80 tracking-wide " +
        // Subtle styling
        "select-none",
        className
      )} 
      {...props} />
  );
}

function CommandGroup({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        // Base styling with Japanese aesthetics
        "text-foreground overflow-hidden p-1 " +
        // Group heading styling with Japanese typography principles
        "[&_[cmdk-group-heading]]:text-muted-foreground/80 " +
        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 " +
        "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium " +
        "[&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase " +
        "[&_[cmdk-group-heading]]:select-none " +
        // Spacing between groups following Ma (negative space)
        "[&:not(:first-child)]:mt-2",
        className
      )}
      {...props} />
  );
}

function CommandSeparator({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        // Subtle separator with Japanese aesthetics
        "bg-border/40 -mx-1 h-px my-2 " +
        // Gentle transitions
        "transition-colors duration-350 ease-gentle",
        className
      )}
      {...props} />
  );
}

function CommandItem({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        // Base layout with Ma (negative space) principles
        "relative flex cursor-default items-center gap-3 px-3 py-2.5 " +
        // Typography with Japanese aesthetics
        "text-sm tracking-wide leading-relaxed " +
        // Wabi-sabi inspired subtle asymmetry
        "rounded-wabi-subtle " +
        // Selection states with gentle transitions
        "data-[selected=true]:bg-accent/80 data-[selected=true]:text-accent-foreground " +
        "data-[selected=true]:shadow-soft " +
        // Icon styling
        "[&_svg:not([class*='text-'])]:text-muted-foreground/70 " +
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
        // Interaction states
        "outline-hidden select-none " +
        "hover:bg-accent/40 hover:text-accent-foreground " +
        // Disabled state
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 " +
        "data-[disabled=true]:text-muted-foreground/50 " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-200 ease-gentle",
        className
      )}
      {...props} />
  );
}

function CommandShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        // Positioning and spacing
        "ml-auto " +
        // Typography with Japanese aesthetics
        "text-xs text-muted-foreground/60 tracking-widest font-mono " +
        // Subtle styling
        "select-none " +
        // Gentle transitions
        "transition-colors duration-200 ease-gentle " +
        // Parent selection state
        "group-data-[selected=true]:text-accent-foreground/80",
        className
      )}
      {...props} />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
