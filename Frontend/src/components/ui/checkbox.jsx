import *as CheckboxPrimitive from "@radix-ui/react-checkbox";

export function Checkbox({ children, ...props }){
    return <CheckboxPrimitive.Root {...props}>{children}</CheckboxPrimitive.Root>
}

export function CheckboxIndicator({ children, ...props }){
    return <CheckboxPrimitive.Indicator {...props}>{children}</CheckboxPrimitive.Indicator>
}