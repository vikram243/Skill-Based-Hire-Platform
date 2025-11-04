import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export function AlertDialog({ children, ...props }){
    return <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
}

export function AlertDialogTrigger({ children, ...props}){
    return <AlertDialogPrimitive.Trigger {...props}>{children}</AlertDialogPrimitive.Trigger>
}

export function AlertDialogPortal({ children, ...props }){
    return <AlertDialogPrimitive.Portal {...props}>{children}</AlertDialogPrimitive.Portal>
}

export function AlertDialogOverlay({ className, ...props }){
    return <AlertDialogPrimitive.Overlay {...props}></AlertDialogPrimitive.Overlay>
}

export function AlertDialogContent({ children, ...props }){
    return <AlertDialogPrimitive.Content {...props}>{children}</AlertDialogPrimitive.Content>
}

export function AlertDialogTitle({ children, ...props }){
    return <AlertDialogPrimitive.Title {...props}>{children}</AlertDialogPrimitive.Title>
}

export function AlertDialogDescription({ children, ...props }){
    return <AlertDialogPrimitive.Description {...props}>{children}</AlertDialogPrimitive.Description>
}

export function AlertDialogCancel({ children, ...props }){
    return <AlertDialogPrimitive.Cancel {...props}>{children}</AlertDialogPrimitive.Cancel>
}

export function AlertDialogAction({ children, ...props}){
    return <AlertDialogPrimitive.Action {...props}>{children}</AlertDialogPrimitive.Action>
}