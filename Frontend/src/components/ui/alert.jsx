import { cn } from "../../lib/utils.js";

export function alert({ className, ...props }){
    return(
        <div
        data-slot = "alert"
        className={cn("",className)}
        {...props}
        />
    )
}

export function alertTitle({ className, ...props }){
    return(
        <div
        data-slot = "alert-title"
        className={cn("",className)}
        {...props}
        />
    )
}

export function alertDiscription({ className, ...props }){
    return(
        <div
        data-slot = "alert-description"
        className={cn("",className)}
        {...props}
        />
    )
}