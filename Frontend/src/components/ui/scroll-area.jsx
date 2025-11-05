import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export function ScrollArea({ children, ...props }) {
  return <ScrollAreaPrimitive.Root {...props}>{children}</ScrollAreaPrimitive.Root>;
}

export function ScrollViewport({ children, ...props }) {
  return <ScrollAreaPrimitive.Viewport {...props}>{children}</ScrollAreaPrimitive.Viewport>;
}

export function Scrollbar({ children, ...props }) {
  return <ScrollAreaPrimitive.Scrollbar {...props}>{children}</ScrollAreaPrimitive.Scrollbar>;
}

export function ScrollThumb({ children, ...props }) {
  return <ScrollAreaPrimitive.Thumb {...props}>{children}</ScrollAreaPrimitive.Thumb>;
}

export function ScrollCorner({ children, ...props }) {
  return <ScrollAreaPrimitive.Corner {...props}>{children}</ScrollAreaPrimitive.Corner>;
}