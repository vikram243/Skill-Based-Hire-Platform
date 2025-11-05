import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "../../lib/utils";

export function Accordion({ children,...props }){
    return <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
}

export function AccordionItem({ children ,...props}){
    return <AccordionPrimitive.Item {...props}>{children}</AccordionPrimitive.Item>
}

export function AccordionTrigger({ children ,...props}){
    return (
        <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger {...props}>
                {children}
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    )
} 

export function AccordionContent({className, children, ...props}){
    return <AccordionPrimitive.Content className = {cn("",className)} {...props}>{children}</AccordionPrimitive.Content>
}