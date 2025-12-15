import * as SelectPrimitive from "@radix-ui/react-select";

export function Select({ children, ...props }) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export function SelectTrigger({ children, ...props }) {
  return <SelectPrimitive.Trigger {...props}>{children}</SelectPrimitive.Trigger>;
}

export function SelectValue({ ...props }) {
  return <SelectPrimitive.Value {...props} />;
}

export function SelectIcon({ children, ...props }) {
  return <SelectPrimitive.Icon {...props}>{children}</SelectPrimitive.Icon>;
}

export function SelectContent({ children, ...props }) {
  return <SelectPrimitive.Content {...props}>{children}</SelectPrimitive.Content>;
}

export function SelectViewport({ children, ...props }) {
  return <SelectPrimitive.Viewport {...props}>{children}</SelectPrimitive.Viewport>;
}

export function SelectGroup({ children, ...props }) {
  return <SelectPrimitive.Group {...props}>{children}</SelectPrimitive.Group>;
}

export function SelectItem({ children, ...props }) {
  return <SelectPrimitive.Item {...props}>{children}</SelectPrimitive.Item>;
}

export function SelectItemText({ children, ...props }) {
  return <SelectPrimitive.ItemText {...props}>{children}</SelectPrimitive.ItemText>;
}

export function SelectItemIndicator({ children, ...props }) {
  return <SelectPrimitive.ItemIndicator {...props}>{children}</SelectPrimitive.ItemIndicator>;
}

export function SelectLabel({ children, ...props }) {
  return <SelectPrimitive.Label {...props}>{children}</SelectPrimitive.Label>;
}

export function SelectSeparator({ ...props }) {
  return <SelectPrimitive.Separator {...props} />;
}

export function SelectScrollUpButton({ children, ...props }) {
  return <SelectPrimitive.ScrollUpButton {...props}>{children}</SelectPrimitive.ScrollUpButton>;
}

export function SelectScrollDownButton({ children, ...props }) {
  return <SelectPrimitive.ScrollDownButton {...props}>{children}</SelectPrimitive.ScrollDownButton>;
}