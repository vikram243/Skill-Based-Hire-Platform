import *as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export function aspectRatio({ classname, ratio =  16/9, children, ...props}){
    return <AspectRatioPrimitive.Root { ...props} ratio = {ratio} className= {cn("",classname)}>{children}</AspectRatioPrimitive.Root>
}