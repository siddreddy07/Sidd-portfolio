import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "../../lib/utils";

/**
 * Animated Shiny Text, adapted from Magic UI (magicui.design). A narrow highlight sweeps across the text every
 * few seconds. Colours come from the site tokens so it works in both themes; the keyframes live in index.css.
 */
export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
  style,
  ...props
}: ComponentPropsWithoutRef<"span"> & { shimmerWidth?: number }) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px`, ...style } as CSSProperties}
      className={cn("shiny-text", className)}
      {...props}
    >
      {children}
    </span>
  );
}
