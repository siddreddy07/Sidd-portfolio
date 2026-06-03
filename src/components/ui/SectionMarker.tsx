import { motion } from 'motion/react';

interface SectionMarkerProps {
  number: string;
  label: string;
}

export default function SectionMarker({ number, label }: SectionMarkerProps) {
  return (
    <div className="flex items-center w-full my-12 col-span-full gap-4 md:gap-8 select-none" id={`marker-${number}`}>
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-[#3a3936]" id={`label-wrapper-${number}`}>
        <span className="text-signal/60">[ {number} ]</span>
        <span className="font-semibold text-text-secondary uppercase">{label}</span>
      </div>
      <motion.div
        className="h-px bg-[#1e1e1e] flex-grow"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
        id={`line-${number}`}
      />
    </div>
  );
}
