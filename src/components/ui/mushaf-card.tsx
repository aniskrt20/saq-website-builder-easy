
import * as React from "react"
import { cn } from "@/lib/utils"

const MushafCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative bg-gradient-to-br from-amber-50/95 to-yellow-50/95 backdrop-blur-sm border-2 border-amber-200/60 shadow-2xl rounded-2xl overflow-hidden",
      "before:absolute before:inset-0 before:bg-islamic-pattern before:opacity-5",
      "after:absolute after:top-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-amber-600 after:via-yellow-500 after:to-amber-600",
      className
    )}
    {...props}
  />
))
MushafCard.displayName = "MushafCard"

const MushafCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-4 border-b border-amber-200/50",
      "bg-gradient-to-r from-amber-100/50 to-yellow-100/50",
      className
    )}
    {...props}
  />
))
MushafCardHeader.displayName = "MushafCardHeader"

const MushafCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight arabic-text text-amber-800",
      className
    )}
    {...props}
  />
))
MushafCardTitle.displayName = "MushafCardTitle"

const MushafCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-4", className)} 
    {...props} 
  />
))
MushafCardContent.displayName = "MushafCardContent"

export { MushafCard, MushafCardHeader, MushafCardTitle, MushafCardContent }
