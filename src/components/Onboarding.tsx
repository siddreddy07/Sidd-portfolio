import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface MoodChoice {
  mood: "happy" | "sad" | "skip";
  expires: number;
}

export default function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<"happy" | "sad" | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("onboarding_mood");
    if (stored) {
      try {
        const parsed: MoodChoice = JSON.parse(stored);
        if (parsed.expires > Date.now()) {
          setDismissed(true);
          return;
        }
      } catch {}
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (visible && !dismissed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible, dismissed]);

  const handleSkip = () => {
    setDismissed(true);
  };

  const handleSelect = (mood: "happy" | "sad") => {
    setSelected(mood);
    const choice: MoodChoice = {
      mood,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("onboarding_mood", JSON.stringify(choice));
    setTimeout(() => {
      setDismissed(true);
    }, 800);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-bg-studio flex flex-col items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-secondary mb-6">
              Welcome
            </span>

            <h1 className="font-display italic text-[clamp(32px,6vw,64px)] text-text-primary leading-none text-center mb-3">
              How are you<br />feeling?
            </h1>

            <p className="font-satoshi text-sm text-text-secondary tracking-wide mb-12">
              This helps me tailor the experience for you
            </p>

            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect("happy")}
                data-cursor="true"
                data-cursor-label="HAPPY"
                className={`relative px-10 py-5 rounded-2xl border transition-colors font-satoshi text-base tracking-wide uppercase
                  ${selected === "happy"
                    ? "bg-accent-lime/10 border-accent-lime text-accent-lime"
                    : "bg-white/[0.03] border-white/10 text-text-primary hover:border-white/25"
                  }`}
              >
                {selected === "happy" && (
                  <motion.span
                    layoutId="check-happy"
                    className="absolute -top-2 -right-2 text-accent-lime text-lg"
                  >
                    ✓
                  </motion.span>
                )}
                <span className="block text-[clamp(20px,3vw,32px)] font-display italic leading-none mb-1">
                  Happy
                </span>
                <span className="block text-[11px] tracking-[0.1em] text-text-secondary/60">
                  Feeling good
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect("sad")}
                data-cursor="true"
                data-cursor-label="SAD"
                className={`relative px-10 py-5 rounded-2xl border transition-colors font-satoshi text-base tracking-wide uppercase
                  ${selected === "sad"
                    ? "bg-white/[0.06] border-white/25 text-text-primary"
                    : "bg-white/[0.03] border-white/10 text-text-primary hover:border-white/25"
                  }`}
              >
                {selected === "sad" && (
                  <motion.span
                    layoutId="check-sad"
                    className="absolute -top-2 -right-2 text-text-primary text-lg"
                  >
                    ✓
                  </motion.span>
                )}
                <span className="block text-[clamp(20px,3vw,32px)] font-display italic leading-none mb-1">
                  Sad
                </span>
                <span className="block text-[11px] tracking-[0.1em] text-text-secondary/60">
                  Not my best
                </span>
              </motion.button>
            </div>

            {selected && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-10 font-mono text-[11px] tracking-[0.15em] uppercase text-accent-lime"
              >
                Thanks — see you next week
              </motion.p>
            )}

            {!selected && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={handleSkip}
                className="mt-10 font-mono text-[11px] tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors border border-white/10 hover:border-white/25 rounded-full px-6 py-2 bg-white/[0.03]"
                data-cursor="true"
                data-cursor-label="SKIP"
              >
                Skip
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
