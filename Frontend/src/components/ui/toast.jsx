import * as ToastPrimitive from "@radix-ui/react-toast";

export function ToastProvider({ children, ...props }) {
  return <ToastPrimitive.Provider {...props}>{children}</ToastPrimitive.Provider>;
}

export function Toast({ children, ...props }) {
  return <ToastPrimitive.Root {...props}>{children}</ToastPrimitive.Root>;
}

export function ToastTitle({ children, ...props }) {
  return <ToastPrimitive.Title {...props}>{children}</ToastPrimitive.Title>;
}

export function ToastDescription({ children, ...props }) {
  return <ToastPrimitive.Description {...props}>{children}</ToastPrimitive.Description>;
}

export function ToastAction({ children, ...props }) {
  return <ToastPrimitive.Action {...props}>{children}</ToastPrimitive.Action>;
}

export function ToastClose({ children, ...props }) {
  return <ToastPrimitive.Close {...props}>{children}</ToastPrimitive.Close>;
}

export function ToastViewport({ ...props }) {
  return <ToastPrimitive.Viewport {...props} />;
}