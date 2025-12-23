import *as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/utils.js";

export function Avatar({ className, children, ...props }){
    return <AvatarPrimitive.Root data-slot="avatar" className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )} {...props}>{children}</AvatarPrimitive.Root>
}

export function AvatarImage({ className, ...props }){
    return <AvatarPrimitive.Image data-slot="avatar-image"
      className={cn("aspect-square size-full", className)} {...props}></AvatarPrimitive.Image>
}

export function AvatarFallback({ className, children, ...props}){
    return <AvatarPrimitive.Fallback data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}{...props}>{children}</AvatarPrimitive.Fallback>
}