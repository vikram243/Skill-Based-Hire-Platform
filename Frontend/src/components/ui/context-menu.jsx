import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export function ContextMenu({ children, ...props }) {
  return <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>;
}

export function ContextMenuTrigger({ children, ...props }) {
  return <ContextMenuPrimitive.Trigger {...props}>{children}</ContextMenuPrimitive.Trigger>;
}

export function ContextMenuContent({ children, ...props }) {
  return <ContextMenuPrimitive.Content {...props}>{children}</ContextMenuPrimitive.Content>;
}

export function ContextMenuItem({ children, ...props }) {
  return <ContextMenuPrimitive.Item {...props}>{children}</ContextMenuPrimitive.Item>;
}

export function ContextMenuCheckboxItem({ children, ...props }) {
  return <ContextMenuPrimitive.CheckboxItem {...props}>{children}</ContextMenuPrimitive.CheckboxItem>;
}

export function ContextMenuRadioItem({ children, ...props }) {
  return <ContextMenuPrimitive.RadioItem {...props}>{children}</ContextMenuPrimitive.RadioItem>;
}

export function ContextMenuLabel({ children, ...props }) {
  return <ContextMenuPrimitive.Label {...props}>{children}</ContextMenuPrimitive.Label>;
}

export function ContextMenuSeparator({ ...props }) {
  return <ContextMenuPrimitive.Separator {...props} />;
}

export function ContextMenuGroup({ children, ...props }) {
  return <ContextMenuPrimitive.Group {...props}>{children}</ContextMenuPrimitive.Group>;
}

export function ContextMenuPortal({ children, ...props }) {
  return <ContextMenuPrimitive.Portal {...props}>{children}</ContextMenuPrimitive.Portal>;
}

export function ContextMenuSub({ children, ...props }) {
  return <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>;
}

export function ContextMenuSubContent({ children, ...props }) {
  return <ContextMenuPrimitive.SubContent {...props}>{children}</ContextMenuPrimitive.SubContent>;
}

export function ContextMenuSubTrigger({ children, ...props }) {
  return <ContextMenuPrimitive.SubTrigger {...props}>{children}</ContextMenuPrimitive.SubTrigger>;
}

export function ContextMenuRadioGroup({ children, ...props }) {
  return <ContextMenuPrimitive.RadioGroup {...props}>{children}</ContextMenuPrimitive.RadioGroup>;
}