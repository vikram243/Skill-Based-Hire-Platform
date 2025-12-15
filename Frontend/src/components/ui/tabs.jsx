import * as TabsPrimitive from "@radix-ui/react-tabs";

export function Tabs({ children, ...props }) {
  return <TabsPrimitive.Root {...props}>{children}</TabsPrimitive.Root>;
}

export function TabsList({ children, ...props }) {
  return <TabsPrimitive.List {...props}>{children}</TabsPrimitive.List>;
}

export function TabsTrigger({ children, ...props }) {
  return <TabsPrimitive.Trigger {...props}>{children}</TabsPrimitive.Trigger>;
}

export function TabsContent({ children, ...props }) {
  return <TabsPrimitive.Content {...props}>{children}</TabsPrimitive.Content>;
}