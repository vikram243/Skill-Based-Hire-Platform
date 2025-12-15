import * as MenubarPrimitive from "@radix-ui/react-menubar";

export function Menubar({ children, ...props }) {
  return <MenubarPrimitive.Root {...props}>{children}</MenubarPrimitive.Root>;
}

export function MenubarMenu({ children, ...props }) {
  return <MenubarPrimitive.Menu {...props}>{children}</MenubarPrimitive.Menu>;
}

export function MenubarTrigger({ children, ...props }) {
  return <MenubarPrimitive.Trigger {...props}>{children}</MenubarPrimitive.Trigger>;
}

export function MenubarContent({ children, ...props }) {
  return <MenubarPrimitive.Content {...props}>{children}</MenubarPrimitive.Content>;
}

export function MenubarItem({ children, ...props }) {
  return <MenubarPrimitive.Item {...props}>{children}</MenubarPrimitive.Item>;
}

export function MenubarSeparator({ ...props }) {
  return <MenubarPrimitive.Separator {...props} />;
}

export function MenubarCheckboxItem({ children, ...props }) {
  return <MenubarPrimitive.CheckboxItem {...props}>{children}</MenubarPrimitive.CheckboxItem>;
}

export function MenubarRadioItem({ children, ...props }) {
  return <MenubarPrimitive.RadioItem {...props}>{children}</MenubarPrimitive.RadioItem>;
}

export function MenubarRadioGroup({ children, ...props }) {
  return <MenubarPrimitive.RadioGroup {...props}>{children}</MenubarPrimitive.RadioGroup>;
}

export function MenubarLabel({ children, ...props }) {
  return <MenubarPrimitive.Label {...props}>{children}</MenubarPrimitive.Label>;
}

export function MenubarSub({ children, ...props }) {
  return <MenubarPrimitive.Sub {...props}>{children}</MenubarPrimitive.Sub>;
}

export function MenubarSubTrigger({ children, ...props }) {
  return <MenubarPrimitive.SubTrigger {...props}>{children}</MenubarPrimitive.SubTrigger>;
}

export function MenubarSubContent({ children, ...props }) {
  return <MenubarPrimitive.SubContent {...props}>{children}</MenubarPrimitive.SubContent>;
}