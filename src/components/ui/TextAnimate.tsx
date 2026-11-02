import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion, type MotionProps, type Variants } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * Text Animate, adapted from Magic UI (magicui.design) by dillionverma. Splits text into segments and staggers a
 * preset animation over them each time it scrolls into view. Renders plain text under prefers-reduced-motion.
 */

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

const motionElements = {
  article: motion.article,
  div: motion.div,
  dd: motion.dd,
  dt: motion.dt,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

type MotionElementType = keyof typeof motionElements;

interface TextAnimateProps extends Omit<MotionProps, "children"> {
  children: string;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
  as?: MotionElementType;
  by?: AnimationType;
  startOnView?: boolean;
  once?: boolean;
  animation?: AnimationVariant;
  accessible?: boolean;
}

const container: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { delayChildren: 0, staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const blurTiming = { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } };
const spring = { duration: 0.3, scale: { type: "spring", damping: 15, stiffness: 300 } } as const;

export const presets: Record<AnimationVariant, Variants> = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.3 } },
    exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    show: { opacity: 1, filter: "blur(0px)", y: 0, transition: blurTiming },
    exit: { opacity: 0, filter: "blur(10px)", y: 20, transition: blurTiming },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
    show: { opacity: 1, filter: "blur(0px)", y: 0, transition: blurTiming },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleUp: {
    hidden: { scale: 0.5, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: spring },
    exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleDown: {
    hidden: { scale: 1.5, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: spring },
    exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
  },
};

function split(text: string, by: AnimationType): string[] {
  if (by === "word") return text.split(/(\s+)/);
  if (by === "character") return text.split("");
  if (by === "line") return text.split("\n");
  return [text];
}

function TextAnimateBase({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  accessible = true,
  ...props
}: TextAnimateProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const MotionComponent = motionElements[as];
  const segments = split(children, by);
  const stagger = duration / segments.length;

  const containerVariants: Variants = variants
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { opacity: { duration: 0.01, delay }, delayChildren: delay, staggerChildren: stagger } },
        exit: { opacity: 0, transition: { staggerChildren: stagger, staggerDirection: -1 } },
      }
    : {
        ...container,
        show: { ...(container.show as object), transition: { delayChildren: delay, staggerChildren: stagger } },
        exit: { ...(container.exit as object), transition: { staggerChildren: stagger, staggerDirection: -1 } },
      };
  const itemVariants = variants ?? presets[animation];

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        variants={containerVariants}
        initial="hidden"
        whileInView={startOnView ? "show" : undefined}
        animate={startOnView ? undefined : "show"}
        exit="exit"
        className={cn("whitespace-pre-wrap", className)}
        viewport={{ once }}
        aria-label={accessible ? children : undefined}
        {...props}
      >
        {accessible && <span className="sr-only">{children}</span>}
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={itemVariants}
            className={cn(by === "line" ? "block" : "inline-block whitespace-pre", segmentClassName)}
            aria-hidden={accessible ? true : undefined}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
}

export const TextAnimate = memo(TextAnimateBase);
