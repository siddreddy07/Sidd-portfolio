import type { ComponentProps } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { presets } from "./TextAnimate";

// Staggered chip list for items TextAnimate can't take (icon + text). Each <PopItem> uses TextAnimate's scaleUp
// preset, and the list replays every time it scrolls into view. Static under prefers-reduced-motion.
const list: Variants = { hidden: {}, show: { transition: { delayChildren: 0.15, staggerChildren: 0.04 } } };

export function PopList(props: ComponentProps<typeof motion.ul>) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.ul {...props} />;
  return <motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }} {...props} />;
}

export function PopItem(props: ComponentProps<typeof motion.li>) {
  return <motion.li variants={presets.scaleUp} {...props} />;
}
