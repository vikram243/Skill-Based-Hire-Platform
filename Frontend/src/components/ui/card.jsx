import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }){
    <div 
    data-slot = "card"
    className = {cn("",className)}
    {...props}/>
}

export function CardHeader({ className, ...props }){
    <div
    data-slot = "card-header"
    className = {cn("",className)}
    {...props}
    />
}

export function CardTitle({ className, ...props }){
    <div
    data-slot = "card-title"
    className = {cn("",className)}
    {...props}
    />
}

export function CardDiscription({ className, ...props }){
    <div
    data-slot = "card-discription"
    className = {cn("",className)}
    {...props}
    />
}

export function CardAction({ className, ...props }){
    <div
    data-slot = "card-action"
    className= {cn("",className)}
    {...props}
    />
}

export function CardContent({ className, ...props }){
    <div
    data-slot = "card-content"
    className= {cn("",className)}
    {...props}
    />
}

export function CardFooter({ className, ...props }){
    <div
    data-slot = "card-footer"
    className= {cn("",className)}
    {...props}
    />
}