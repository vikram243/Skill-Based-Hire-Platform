import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export function RadioGroup({ children, ...props }) {
  return <RadioGroupPrimitive.Root {...props}>{children}</RadioGroupPrimitive.Root>;
}

export function RadioGroupItem({ children, ...props }) {
  return (
    <RadioGroupPrimitive.Item {...props}>
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export function RadioGroupIndicator({ children, ...props }) {
  return (
    <RadioGroupPrimitive.Indicator {...props}>
      {children}
    </RadioGroupPrimitive.Indicator>
  );
}