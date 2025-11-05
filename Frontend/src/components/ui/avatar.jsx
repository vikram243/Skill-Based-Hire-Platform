import *as AvatarPrimitive from "@radix-ui/react-avatar";

export function avatar({ className, children, ...props }){
    return <AvatarPrimitive.Root {...props}>{children}</AvatarPrimitive.Root>
}

export function avatarImage({ className, ...props }){
    return <AvatarPrimitive.Image {...props}></AvatarPrimitive.Image>
}

export function fallBack({ className, children, ...props}){
    return <AvatarPrimitive.Fallback {...props}>{children}</AvatarPrimitive.Fallback>
}