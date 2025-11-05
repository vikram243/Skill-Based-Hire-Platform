import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch({ children, ...props }) {
  return <SwitchPrimitive.Root {...props}>{children}</SwitchPrimitive.Root>;
}

export function SwitchThumb({ ...props }) {
  return <SwitchPrimitive.Thumb {...props} />;
}