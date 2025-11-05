import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

export function ToggleGroup({ children, ...props }) {
  return <ToggleGroupPrimitive.Root {...props}>{children}</ToggleGroupPrimitive.Root>;
}

export function ToggleGroupItem({ children, ...props }) {
  return <ToggleGroupPrimitive.Item {...props}>{children}</ToggleGroupPrimitive.Item>;
}
