import { useContext } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "../../lib/utils.js";
import { MinusIcon } from "lucide-react"

export function InputOtp({ className, ContainerClassName, ...props }) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn("", ContainerClassName)}
            className={cn("", className)}
            {...props}
        />
    )
}

export function InputOtpGroup({ className, ...props }) {
    return (
        <div
            data-slot="input-otp-group"
            className={cn("", className)}
            {...props}
        />
    )
}

export function InputOtpSlot({ index, className, ...props }) {
    const InputOtpContext = useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = InputOtpContext?.slots[index] || {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn("", className)}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
                </div>
            )}
        </div>
    )
}

export function InputOtpSeparator({ className, ...props }) {
    return (
        <div
            data-slot="input-otp-Separator"
            className={cn("", className)}
            {...props}
        >
            <MinusIcon />
        </div>
    )
}