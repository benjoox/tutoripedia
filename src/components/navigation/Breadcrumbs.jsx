/**
 * Breadcrumbs Component
 * 
 * Provides breadcrumb navigation for tutorial pages, showing the current
 * location in the tutorial hierarchy.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconChevronRight, IconHome } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

/**
 * Individual breadcrumb item
 */
function BreadcrumbItem({ href, children, isLast = false, className }) {
  const content = (
    <span className={cn(
      'flex items-center gap-1 text-sm transition-colors',
      isLast 
        ? 'text-foreground font-medium' 
        : 'text-muted-foreground hover:text-foreground',
      className
    )}>
      {children}
    </span>
  )

  if (isLast || !href) {
    return content
  }

  return (
    <Link to={href} className="hover:no-underline">
      {content}
    </Link>
  )
}

/**
 * Breadcrumb separator
 */
function BreadcrumbSeparator() {
  return (
    <IconChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
  )
}

/**
 * Main Breadcrumbs component
 */
function Breadcrumbs({ 
  tutorial, 
  currentPhase, 
  className,
  showHome = true,
  maxItems = 4 
}) {
  const location = useLocation()
  
  // Build breadcrumb items
  const items = []

  // Home item
  if (showHome) {
    items.push({
      href: '/',
      label: 'Home',
      icon: <IconHome className="w-4 h-4" />
    })
  }

  // Tutorial item
  if (tutorial) {
    items.push({
      href: `/tutorial/${tutorial.id}`,
      label: tutorial.shortTitle || tutorial.title,
      isTutorial: true
    })

    // Phase item
    if (currentPhase) {
      items.push({
        href: `/tutorial/${tutorial.id}/${currentPhase.id}`,
        label: currentPhase.title,
        isPhase: true
      })
    }
  }

  // Truncate items if too many
  let displayItems = items
  if (items.length > maxItems) {
    displayItems = [
      items[0], // Always show first (home)
      { label: '...', isEllipsis: true },
      ...items.slice(-(maxItems - 2)) // Show last few items
    ]
  }

  if (displayItems.length === 0) {
    return null
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-2', className)}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.isEllipsis

          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Separator (except for first item) */}
              {index > 0 && <BreadcrumbSeparator />}
              
              {/* Breadcrumb item */}
              {isEllipsis ? (
                <span className="text-muted-foreground text-sm">...</span>
              ) : (
                <BreadcrumbItem
                  href={isLast ? undefined : item.href}
                  isLast={isLast}
                  className={cn(
                    item.isTutorial && 'font-medium',
                    item.isPhase && 'text-primary'
                  )}
                >
                  {item.icon && (
                    <span className="mr-1">{item.icon}</span>
                  )}
                  <span className="truncate max-w-32 sm:max-w-48">
                    {item.label}
                  </span>
                </BreadcrumbItem>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Compact breadcrumbs for mobile
 */
function CompactBreadcrumbs({ tutorial, currentPhase, className }) {
  if (!tutorial) return null

  const currentItem = currentPhase || tutorial
  const parentHref = currentPhase ? `/tutorial/${tutorial.id}` : '/'
  const parentLabel = currentPhase ? tutorial.shortTitle || tutorial.title : 'Home'

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-2', className)}
    >
      <Link 
        to={parentHref}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        {parentLabel}
      </Link>
      <BreadcrumbSeparator />
      <span className="text-foreground font-medium text-sm truncate">
        {currentItem.title}
      </span>
    </nav>
  )
}

/**
 * Responsive breadcrumbs that switches between full and compact views
 */
function ResponsiveBreadcrumbs({ tutorial, currentPhase, className }) {
  return (
    <>
      {/* Full breadcrumbs on larger screens */}
      <div className="hidden sm:block">
        <Breadcrumbs 
          tutorial={tutorial} 
          currentPhase={currentPhase} 
          className={className}
        />
      </div>
      
      {/* Compact breadcrumbs on mobile */}
      <div className="sm:hidden">
        <CompactBreadcrumbs 
          tutorial={tutorial} 
          currentPhase={currentPhase} 
          className={className}
        />
      </div>
    </>
  )
}

export { BreadcrumbItem, BreadcrumbSeparator, CompactBreadcrumbs }
export default ResponsiveBreadcrumbs