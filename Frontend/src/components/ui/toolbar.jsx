import * as ToolbarPrimitive from "@radix-ui/react-toolbar";

export function Toolbar({ children, ...props }) {
  return <ToolbarPrimitive.Root {...props}>{children}</ToolbarPrimitive.Root>;
}

export function ToolbarButton({ children, ...props }) {
  return <ToolbarPrimitive.Button {...props}>{children}</ToolbarPrimitive.Button>;
}

export function ToolbarSeparator({ ...props }) {
  return <ToolbarPrimitive.Separator {...props} />;
}

export function ToolbarLink({ children, ...props }) {
  return <ToolbarPrimitive.Link {...props}>{children}</ToolbarPrimitive.Link>;
}

export function ToolbarToggleGroup({ children, ...props }) {
  return <ToolbarPrimitive.ToggleGroup {...props}>{children}</ToolbarPrimitive.ToggleGroup>;
}

export function ToolbarToggleItem({ children, ...props }) {
  return <ToolbarPrimitive.ToggleItem {...props}>{children}</ToolbarPrimitive.ToggleItem>;
}