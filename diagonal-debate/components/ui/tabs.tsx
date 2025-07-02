"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as ReactDOM from "react-dom"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

// Utility to merge multiple refs
function mergeRefs<T = any>(refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(value)
      else if (ref && typeof ref === "object") (ref as React.MutableRefObject<T | null>).current = value
    })
  }
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'w-full flex gap-0 bg-white border border-gray-200 p-1 rounded-lg shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.List>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Standardized tab coloring
      'bg-transparent text-red-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold px-6 py-2 rounded-md',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
