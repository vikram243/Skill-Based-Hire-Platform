import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils.js";

function Badge(asChild,className,...props){
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
        className={cn("",className)}
        {...props}
        />
    )
}

export { Badge }