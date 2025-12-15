import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value, ...props }) {
  return (
    <ProgressPrimitive.Root {...props}>
      <ProgressPrimitive.Indicator
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}