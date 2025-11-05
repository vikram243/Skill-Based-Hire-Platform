import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function Tooltip({ children, ...props }) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

export function TooltipTrigger({ children, ...props }) {
  return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>;
}

export function TooltipContent({ children, ...props }) {
  return <TooltipPrimitive.Content {...props}>{children}</TooltipPrimitive.Content>;
}

export function TooltipProvider({ children, ...props }) {
  return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
}