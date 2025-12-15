import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../../lib/utils.js";

export function Drawer({ className, children, ...props}){
    return <DrawerPrimitive.Root
    className = {cn("",className)}
    {...props}
    >
        {children}
    </DrawerPrimitive.Root>
}

export function DrawerTrigger({ className, children, ...props}){
    return <DrawerPrimitive.Trigger
    className = {cn("",className)}
    {...props}
    >
        {children}
    </DrawerPrimitive.Trigger>
}

export function DrawerPortal({ className, children, ...props}){
    return <DrawerPrimitive.Portal
    className = {cn("",className)}
    {...props}
    >
        {children}
    </DrawerPrimitive.Portal>
}

export function DrawerContent({ className, children, ...props}){
    return <DrawerPrimitive.Content
    className = {cn("",className)}
    {...props}
    >
        {children}
    </DrawerPrimitive.Content>
}

export function DrawerOverlay({ className, ...props}){
    return <DrawerPrimitive.Overlay
    className = {cn("",className)}
    {...props}
    />
}