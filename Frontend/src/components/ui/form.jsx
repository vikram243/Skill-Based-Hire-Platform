import * as FormPrimitive from "@radix-ui/react-form";

export function Form({ children, ...props }) {
  return <FormPrimitive.Root {...props}>{children}</FormPrimitive.Root>;
}

export function FormField({ children, ...props }) {
  return <FormPrimitive.Field {...props}>{children}</FormPrimitive.Field>;
}

export function FormLabel({ children, ...props }) {
  return <FormPrimitive.Label {...props}>{children}</FormPrimitive.Label>;
}

export function FormControl({ children, ...props }) {
  return <FormPrimitive.Control {...props}>{children}</FormPrimitive.Control>;
}

export function FormMessage({ children, ...props }) {
  return <FormPrimitive.Message {...props}>{children}</FormPrimitive.Message>;
}

export function FormValidityState({ children, ...props }) {
  return <FormPrimitive.ValidityState {...props}>{children}</FormPrimitive.ValidityState>;
}

export function FormSubmit({ children, ...props }) {
  return <FormPrimitive.Submit {...props}>{children}</FormPrimitive.Submit>;
}