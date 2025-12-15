import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownMenu({ children, ...props }) {
  return <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>;
}

export function DropdownMenuTrigger({ children, ...props }) {
  return <DropdownMenuPrimitive.Trigger {...props}>{children}</DropdownMenuPrimitive.Trigger>;
}

export function DropdownMenuContent({ children, ...props }) {
  return <DropdownMenuPrimitive.Content {...props}>{children}</DropdownMenuPrimitive.Content>;
}

export function DropdownMenuItem({ children, ...props }) {
  return <DropdownMenuPrimitive.Item {...props}>{children}</DropdownMenuPrimitive.Item>;
}

export function DropdownMenuSeparator({ ...props }) {
  return <DropdownMenuPrimitive.Separator {...props} />;
}