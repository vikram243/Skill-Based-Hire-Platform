import * as SliderPrimitive from "@radix-ui/react-slider";

export function Slider({ children, ...props }) {
  return <SliderPrimitive.Root {...props}>{children}</SliderPrimitive.Root>;
}

export function SliderTrack({ children, ...props }) {
  return <SliderPrimitive.Track {...props}>{children}</SliderPrimitive.Track>;
}

export function SliderRange({ ...props }) {
  return <SliderPrimitive.Range {...props} />;
}

export function SliderThumb({ ...props }) {
  return <SliderPrimitive.Thumb {...props} />;
}