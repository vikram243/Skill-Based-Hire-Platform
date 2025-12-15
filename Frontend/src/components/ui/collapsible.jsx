import *as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export function Collapsible({ children, ...props}){
    return <CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>
}

export function CollapsibleTrigger({ children, ...props}){
    return <CollapsiblePrimitive.Trigger {...props}>{children}</CollapsiblePrimitive.Trigger>
}

export function CollapsibleContent({ children, ...props}){
    return <CollapsiblePrimitive.Content {...props}>{children}</CollapsiblePrimitive.Content>
}