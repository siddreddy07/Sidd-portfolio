import React from "react";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col space-y-4">
          <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
            About
          </span>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Dynamic Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Left Column Statement */}
          <div className="lg:col-span-7">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-[clamp(32px,5.5vw,64px)] text-[#f0ece4] leading-[1.1] tracking-tight"
            >
              Building resilient server structures with mathematical predictability and clean interface boundaries.
            </motion.h3>
          </div>

          {/* Right Column Supporting Description */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-satoshi font-normal text-[16px] text-[#6b6560] leading-relaxed"
            >
              Based in Visakhapatnam, India. Graduated in Computer Science & Engineering (B.Tech, CGPA 7.99) from Andhra University College of Engineering. 
              <br /><br />
              I operate at the intersection of robust backend orchestration, performant relational data stores, and event-driven concurrency. I build optimized, type-safe API gateways and CLI instruments that help developers ship software without friction.
            </motion.p>
          </div>

        </div>

      </div>
    </section>
  );
}
