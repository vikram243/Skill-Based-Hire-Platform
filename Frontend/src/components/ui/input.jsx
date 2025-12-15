import { cn } from "../../lib/utils.js";

export function Input( className, type, ...props){
    return(
        <input type={type} className={cn("",className)} {...props} />
    )
}