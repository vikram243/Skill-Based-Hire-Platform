import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "./Button.jsx";

const CarouselContext = createContext(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a Carousel");
  return context;
}

export function Carousel({ orientation = "horizontal", opts = {}, className, children, ...props }) {
  const [carouselRef, api] = useEmblaCarousel({ axis: orientation === "horizontal" ? "x" : "y", ...opts });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api, onSelect]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <CarouselContext.Provider
      value={{ carouselRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext, orientation }}
    >
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, children }) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}>
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({ className, children }) {
  const { orientation } = useCarousel();
  return (
    <div
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CarouselPrevious({ className, ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowLeft />
    </Button>
  );
}

export function CarouselNext({ className, ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowRight />
    </Button>
  );
}