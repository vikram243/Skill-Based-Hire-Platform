import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export function Tabs({ className, children, ...props }) {
  return <TabsPrimitive.Root data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}>{children}</TabsPrimitive.Root>;
}

export function TabsList({ className, children, ...props }) {
  return <TabsPrimitive.List data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-0.75",
        className
      )}
      {...props}>{children}</TabsPrimitive.List>;
}

export function TabsTrigger({ className, children, ...props }) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-1 py-1 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>{children}</TabsPrimitive.Trigger>;
}

export function TabsContent({ className, children, ...props }) {
  return <TabsPrimitive.Content data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}>{children}</TabsPrimitive.Content>;
}