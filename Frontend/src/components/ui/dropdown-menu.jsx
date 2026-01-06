import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils.js";

export function DropdownMenu({ children, ...props }) {
  return (
    <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
}

export function DropdownMenuTrigger({ children, ...props }) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}

export function DropdownMenuContent({
  children,
  className,
  sideOffset = 4,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Content
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-32 rounded-md border border-border p-1 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
}

export function DropdownMenuItem({
  children,
  inset,
  variant,
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}