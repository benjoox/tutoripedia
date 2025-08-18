import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Typography variants following Japanese design principles
const typographyVariants = cva(
  // Base typography with Japanese aesthetics
  "text-foreground transition-colors duration-250 ease-gentle",
  {
    variants: {
      variant: {
        // Heading variants with Japanese typography hierarchy
        h1: "scroll-m-20 text-4xl font-semibold tracking-tight leading-tight",
        h2: "scroll-m-20 text-3xl font-semibold tracking-tight leading-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight leading-snug",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight leading-snug",
        h5: "scroll-m-20 text-lg font-medium tracking-tight leading-snug",
        h6: "scroll-m-20 text-base font-medium tracking-tight leading-snug",
        
        // Body text variants with optimal readability
        body: "text-base leading-relaxed tracking-wide",
        "body-sm": "text-sm leading-relaxed tracking-wide",
        "body-lg": "text-lg leading-relaxed tracking-wide",
        
        // UI text variants for interface elements
        caption: "text-xs leading-normal tracking-wide text-muted-foreground",
        label: "text-sm font-medium leading-normal tracking-wide",
        
        // Special variants following Japanese principles
        subtle: "text-sm leading-relaxed tracking-wide text-muted-foreground", // Shibui (subtle beauty)
        emphasis: "text-base font-medium leading-relaxed tracking-wide", // For important content
        
        // Code and monospace variants
        code: "font-mono text-sm leading-normal tracking-normal bg-muted px-1.5 py-0.5 rounded-sm",
        "code-block": "font-mono text-sm leading-relaxed tracking-normal",
      },
      
      // Spacing variants following Ma (negative space) principles
      spacing: {
        none: "mb-0",
        tight: "mb-2",
        normal: "mb-4", // Default spacing
        relaxed: "mb-6",
        loose: "mb-8",
      },
      
      // Color variants for different contexts
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        success: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "body",
      spacing: "normal",
      color: "default",
    },
  }
)

// Main Typography component
const Typography = React.forwardRef(({ 
  className, 
  variant = "body", 
  spacing = "normal",
  color = "default",
  as: Component = "p",
  ...props 
}, ref) => {
  // Map variants to appropriate HTML elements by default
  const defaultElements = {
    h1: "h1",
    h2: "h2", 
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body: "p",
    "body-sm": "p",
    "body-lg": "p",
    caption: "span",
    label: "span",
    subtle: "span",
    emphasis: "span",
    code: "code",
    "code-block": "pre",
  }
  
  const ElementType = Component === "p" ? (defaultElements[variant] || "p") : Component
  
  return (
    <ElementType
      className={cn(typographyVariants({ variant, spacing, color }), className)}
      ref={ref}
      {...props}
    />
  )
})
Typography.displayName = "Typography"

// Convenience components for common use cases
const Heading = React.forwardRef(({ level = 1, className, ...props }, ref) => {
  const variant = `h${Math.min(Math.max(level, 1), 6)}`
  return (
    <Typography
      variant={variant}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Heading.displayName = "Heading"

const Text = React.forwardRef(({ size = "base", className, ...props }, ref) => {
  const variantMap = {
    xs: "caption",
    sm: "body-sm", 
    base: "body",
    lg: "body-lg",
  }
  
  return (
    <Typography
      variant={variantMap[size] || "body"}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Text.displayName = "Text"

const Code = React.forwardRef(({ block = false, className, ...props }, ref) => {
  return (
    <Typography
      variant={block ? "code-block" : "code"}
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Code.displayName = "Code"

// Specialized components for Japanese design principles
const Subtle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Typography
      variant="subtle"
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Subtle.displayName = "Subtle"

const Emphasis = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Typography
      variant="emphasis"
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Emphasis.displayName = "Emphasis"

export { 
  Typography, 
  Heading, 
  Text, 
  Code, 
  Subtle, 
  Emphasis,
  typographyVariants 
}