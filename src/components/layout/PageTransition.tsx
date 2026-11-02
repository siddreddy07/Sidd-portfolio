import { useLayoutEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router";

const EASE = [0.22, 1, 0.36, 1] as const;

// One page inside Layout's AnimatePresence. It mounts only after the previous page has finished leaving, so this is
// where the scroll position is set: the requested home section (passed in router state, never in the URL), or the
// top. Done before paint, and instantly, so the html `scroll-behavior: smooth` doesn't animate the jump.
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { state } = useLocation();
  const section = (state as { section?: string } | null)?.section;

  useLayoutEffect(() => {
    const el = section ? document.getElementById(section) : null;
    if (el) {
      el.scrollIntoView({ behavior: "instant" });
      window.history.replaceState({ ...window.history.state, usr: null }, "");
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } }}
    >
      {children}
    </motion.div>
  );
}
