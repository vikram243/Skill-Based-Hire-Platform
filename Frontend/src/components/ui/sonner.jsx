import { Toaster as Sonner } from "sonner";
import { cn } from "../../lib/utils.js"

function Toaster({ className, ...props }){
    return <Sonner
    className = {cn("",className)}
    {...props}
    />
}

export default Toaster;