import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export function NavigationMenu({ children, ...props }) {
  return <NavigationMenuPrimitive.Root {...props}>{children}</NavigationMenuPrimitive.Root>;
}

export function NavigationMenuList({ children, ...props }) {
  return <NavigationMenuPrimitive.List {...props}>{children}</NavigationMenuPrimitive.List>;
}

export function NavigationMenuItem({ children, ...props }) {
  return <NavigationMenuPrimitive.Item {...props}>{children}</NavigationMenuPrimitive.Item>;
}

export function NavigationMenuTrigger({ children, ...props }) {
  return <NavigationMenuPrimitive.Trigger {...props}>{children}</NavigationMenuPrimitive.Trigger>;
}

export function NavigationMenuContent({ children, ...props }) {
  return <NavigationMenuPrimitive.Content {...props}>{children}</NavigationMenuPrimitive.Content>;
}

export function NavigationMenuLink({ children, ...props }) {
  return <NavigationMenuPrimitive.Link {...props}>{children}</NavigationMenuPrimitive.Link>;
}

export function NavigationMenuIndicator({ ...props }) {
  return <NavigationMenuPrimitive.Indicator {...props} />;
}

export function NavigationMenuViewport({ ...props }) {
  return <NavigationMenuPrimitive.Viewport {...props} />;
}

export function NavigationMenuSub({ children, ...props }) {
  return <NavigationMenuPrimitive.Sub {...props}>{children}</NavigationMenuPrimitive.Sub>;
}