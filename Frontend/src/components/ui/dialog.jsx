import *as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog({ children, ...props }){
    return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

export function DialogTrigger({ children, ...props }){
    return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
}

export function DialogPortal({ children, ...props }){
    return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
}

export function DialogOverlay({ ...props }){
    return <DialogPrimitive.Overlay {...props}/>
}

export function DialogContent({ children, ...props }){
    return <DialogPrimitive.Content {...props}>{children}</DialogPrimitive.Content>
}

export function DialogClose({ children, ...props }){
    return <DialogPrimitive.Close {...props}>{children}</DialogPrimitive.Close>
}

export function DialogDescription({ children, ...props }){
    return <DialogPrimitive.Description {...props}>{children}</DialogPrimitive.Description>
}

export function DialogTitle({ children, ...props }){
    return <DialogPrimitive.Title {...props}>{children}</DialogPrimitive.Title>
}