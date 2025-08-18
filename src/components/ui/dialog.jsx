import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { IconX } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // Seijaku (tranquility) overlay with gentle fade
        "fixed inset-0 z-50 bg-black/50 " +
        // Gentle entrance and exit animations
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out " +
        // Smooth backdrop blur effect
        "backdrop-blur-sm " +
        // Wabi-sabi subtle texture
        "wabi-sabi-texture",
        className
      )}
      {...props} />
  );
}

function DialogContent({
  className,
  children,
  ...props
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Base styling with Japanese aesthetics
          "bg-background text-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] " +
          // Ma (negative space) - generous spacing
          "gap-6 p-6 " +
          // Wabi-sabi (imperfect beauty) - natural asymmetry
          "rounded-wabi-card border border-border/50 shadow-wabi-gentle " +
          // Seijaku (tranquility) - gentle animations
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out " +
          "seijaku-transition-transform " +
          // Responsive sizing
          "sm:max-w-lg " +
          // Subtle texture
          "wabi-sabi-texture",
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close
          className={cn(
            // Positioning and sizing
            "absolute top-4 right-4 " +
            // Japanese-inspired styling
            "rounded-wabi-button opacity-70 " +
            // Seijaku (tranquility) transitions
            "seijaku-transition-opacity seijaku-hover-lift " +
            // Interactive states
            "hover:opacity-100 hover:bg-accent/10 " +
            // Focus states with gentle ring
            "focus:ring-2 focus:ring-ring/20 focus:ring-offset-2 focus:outline-none " +
            "focus-visible:opacity-100 focus-visible:bg-accent/10 " +
            // Accessibility
            "disabled:pointer-events-none " +
            // Icon sizing
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
            // Minimum touch target
            "min-h-[44px] min-w-[44px] flex items-center justify-center"
          )}>
          <IconX />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-snug font-semibold tracking-tight", className)}
      {...props} />
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm leading-relaxed tracking-[0.01em]", className)}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
