"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function TabsMobile({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsListMobile({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-auto sm:h-9 w-full items-center justify-start sm:justify-center rounded-xl p-[3px] flex",
        // Mobile-specific: allow wrapping on very small screens
        "flex-wrap sm:flex-nowrap",
        // Mobile-specific: adjust gap for better spacing
        "gap-1 sm:gap-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsTriggerMobile({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Active state styles
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground",
        "data-[state=active]:shadow-sm",
        // Focus styles
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
        "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
        // Text styles
        "text-foreground dark:text-muted-foreground",
        // Layout styles
        "inline-flex items-center justify-center gap-1.5",
        // Mobile-specific: flexible height and width
        "h-auto min-h-[2.25rem] sm:h-[calc(100%-1px)]",
        "flex-auto sm:flex-1",
        // Mobile-specific: smaller padding on mobile
        "px-2 py-1.5 sm:px-3 sm:py-1",
        // Mobile-specific: smaller text on mobile
        "text-xs sm:text-sm",
        // Common styles
        "font-medium rounded-xl border border-transparent",
        "whitespace-nowrap transition-[color,box-shadow]",
        "focus-visible:ring-[3px] focus-visible:outline-1",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Mobile-specific: allow text wrapping on very small screens if needed
        "xs:whitespace-nowrap whitespace-normal text-center",
        className,
      )}
      {...props}
    />
  );
}

function TabsContentMobile({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { TabsMobile, TabsListMobile, TabsTriggerMobile, TabsContentMobile };