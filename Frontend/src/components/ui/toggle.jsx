import * as TogglePrimitive from "@radix-ui/react-toggle";

export function Toggle({ children, ...props }) {
  return <TogglePrimitive.Root {...props}>{children}</TogglePrimitive.Root>;
}