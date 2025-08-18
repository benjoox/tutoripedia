"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  // Base styling with Japanese aesthetics - Ma (negative space) and Kanso (simplicity)
  "relative flex shrink-0 overflow-hidden " +
  // Gentle transitions for Seijaku (tranquility)
  "transition-all duration-250 ease-gentle " +
  // Subtle shadow for depth without harshness
  "shadow-xs " +
  // Focus states for accessibility
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  // Wabi-sabi inspired subtle asymmetry in border radius
  "rounded-wabi-gentle",
  {
    variants: {
      size: {
        sm: "size-6",      // 24px - compact size
        md: "size-8",      // 32px - default size
        lg: "size-10",     // 40px - larger size
        xl: "size-12",     // 48px - prominent size
        "2xl": "size-16",  // 64px - hero size
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const avatarFallbackVariants = cva(
  // Base styling following Japanese principles
  "flex size-full items-center justify-center " +
  // Wabi-sabi inspired subtle asymmetry
  "rounded-wabi-gentle " +
  // Typography with Japanese aesthetics
  "text-sm font-medium tracking-wide " +
  // Gentle transitions
  "transition-colors duration-250 ease-gentle " +
  // Subtle background with natural tones
  "bg-secondary/60 text-secondary-foreground " +
  // Hover state for interactive avatars
  "group-hover:bg-secondary/80 " +
  // Selection state
  "select-none"
)

function Avatar({
  className,
  size,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props} />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        // Ensure proper aspect ratio and fit
        "aspect-square size-full object-cover " +
        // Wabi-sabi inspired subtle asymmetry
        "rounded-wabi-gentle " +
        // Gentle transitions for loading states
        "transition-opacity duration-250 ease-gentle",
        className
      )}
      {...props} />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants(), className)}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }
