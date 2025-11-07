import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils.js";

function Button( asChild, className, ...props){
    const Comp = asChild ? Slot : "button";
    
    return (
        <Comp
        className = {cn("",className)}
        {...props}
        />
    )
}

export { Button }