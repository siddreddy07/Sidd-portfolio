import { useLayoutEffect, useRef, useState } from "react";

/** Single-line text scaled so it spans exactly the width of its container, at any screen size. */
export default function FitText({ children, className = "" }: { children: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    const span = probe.current;
    if (!el || !span) return;
    const fit = () => {
      // The probe is laid out at 100px; scale that to the container's width.
      const natural = span.getBoundingClientRect().width;
      if (natural > 0) setSize((el.clientWidth / natural) * 100);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // Web fonts change the glyph widths once they arrive.
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={box} className="relative w-full overflow-hidden">
      <span ref={probe} aria-hidden className="invisible absolute left-0 top-0 whitespace-nowrap" style={{ fontSize: 100 }}>
        <span className={className}>{children}</span>
      </span>
      <span
        className={`block whitespace-nowrap ${className}`}
        style={{ fontSize: size ?? 0, lineHeight: 0.95, visibility: size ? "visible" : "hidden" }}
      >
        {children}
      </span>
    </div>
  );
}
