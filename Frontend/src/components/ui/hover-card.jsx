import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export function HoverCard({ children, ...props }) {
  return <HoverCardPrimitive.Root {...props}>{children}</HoverCardPrimitive.Root>;
}

export function HoverCardTrigger({ children, ...props }) {
  return <HoverCardPrimitive.Trigger {...props}>{children}</HoverCardPrimitive.Trigger>;
}

export function HoverCardContent({ children, ...props }) {
  return <HoverCardPrimitive.Content {...props}>{children}</HoverCardPrimitive.Content>;
}

export function HoverCardPortal({ children, ...props }) {
  return <HoverCardPrimitive.Portal {...props}>{children}</HoverCardPrimitive.Portal>;
}

export function HoverCardArrow({ ...props }) {
  return <HoverCardPrimitive.Arrow {...props} />;
}
