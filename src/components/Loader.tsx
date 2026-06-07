import { useEffect, useRef, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"counting" | "snap" | "splitting" | "done">("counting");
  const [showMeta, setShowMeta] = useState(false);
  const rafRef = useRef<number>(null);
  const startRef = useRef<number>(null);

  const prefersReducedMotion = useRef(false);
  const isMobile = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isMobile.current = window.innerWidth < 640;

    if (prefersReducedMotion.current) {
      setCount(100);
      setPhase("snap");
      const t1 = setTimeout(() => setPhase("splitting"), 300);
      const t2 = setTimeout(() => {
        setPhase("done");
        onComplete();
        window.dispatchEvent(new CustomEvent("sidd:loaded"));
      }, 700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    setShowMeta(true);
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current!;
      const totalCounterTime = 1750;

      if (elapsed >= totalCounterTime) {
        setCount(100);
        setPhase("snap");

        setTimeout(() => {
          setPhase("splitting");
          setShowMeta(false);

          try {
            if (!isMobile.current) {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.value = 60;
              gain.gain.setValueAtTime(0, ctx.currentTime);
              gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
              gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.08);
            }
          } catch {}

          setTimeout(() => {
            setPhase("done");
            onComplete();
            window.dispatchEvent(new CustomEvent("sidd:loaded"));
          }, 1020);
        }, 120);

        return;
      }

      const t = elapsed / totalCounterTime;
      let value: number;

      if (t < 0.343) {
        const p = t / 0.343;
        value = 60 * (1 - Math.pow(1 - p, 1.5));
      } else if (t < 0.629) {
        const p = (t - 0.343) / 0.286;
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        value = 60 + 25 * ease;
      } else if (t < 0.971) {
        const p = (t - 0.629) / 0.343;
        value = 85 + 14 * (p * p);
      } else {
        value = 99;
      }

      setCount(Math.round(value));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  const counterSize = "clamp(120px, 28vw, 380px)";
  const counterColor = "#f0ece4";

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none" style={{ background: "transparent" }}>
      <style>{`
        @keyframes loaderFadeMeta {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
      `}</style>

      {/* TOP PANEL */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden"
        style={{
          height: "50vh",
          background: "#080808",
          transform: phase === "splitting" ? "translateY(-100%)" : "translateY(0%)",
          transition: phase === "splitting" ? "transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)" : "none",
        }}
      >
        <div
          className="absolute font-display italic select-none leading-none"
          style={{
            fontSize: counterSize,
            letterSpacing: "-0.04em",
            color: counterColor,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {count}
        </div>

        {showMeta && !isMobile.current && !prefersReducedMotion.current && (
          <div
            className="absolute font-mono"
            style={{
              right: "40px",
              top: "40px",
              fontSize: "11px",
              color: "#6b6560",
              opacity: 0.6,
              animation: "loaderFadeMeta 0.4s ease-out 0.3s forwards",
              transition: phase === "splitting" ? "opacity 0.2s ease-out" : "none",
            }}
          >
            Backend Engineer
          </div>
        )}
      </div>

      {/* BOTTOM PANEL */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden"
        style={{
          height: "50vh",
          background: "#080808",
          transform: phase === "splitting" ? "translateY(100%)" : "translateY(0%)",
          transition: phase === "splitting" ? "transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)" : "none",
        }}
      >
        <div
          className="absolute font-display italic select-none leading-none"
          style={{
            fontSize: counterSize,
            letterSpacing: "-0.04em",
            color: counterColor,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {count}
        </div>

        {showMeta && !isMobile.current && !prefersReducedMotion.current && (
          <div
            className="absolute font-mono"
            style={{
              left: "40px",
              bottom: "40px",
              fontSize: "11px",
              color: "#6b6560",
              opacity: 0.6,
              animation: "loaderFadeMeta 0.4s ease-out 0.3s forwards",
              transition: phase === "splitting" ? "opacity 0.2s ease-out" : "none",
            }}
          >
            sidd.dev · 2025
          </div>
        )}
      </div>
    </div>
  );
}
