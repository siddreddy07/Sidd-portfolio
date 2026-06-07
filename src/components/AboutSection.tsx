import React from "react";
import { motion } from "motion/react";

const headingParts = [
  "Full-Stack Developer who enjoys",
  "building backend systems,",
  "AI-powered applications, and developer tools."
];

const bodyLines = [
  "Built scalable APIs, authentication systems, AI agents, and automation workflows using Node.js, PostgreSQL, MongoDB, Redis, and modern LLM frameworks.",
  "Passionate about turning ideas into practical products that improve user and developer experiences. Based in Visakhapatnam, India — B.Tech CSE, Andhra University (CGPA 7.99)."
];

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number; key?: string | number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col space-y-4">
          <RevealText>
            <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
              About
            </span>
          </RevealText>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Dynamic Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Left Column Statement */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            {headingParts.map((part, i) => (
              <RevealText key={i} delay={i * 0.12}>
                <h3 className={`font-display italic text-[clamp(32px,5.5vw,64px)] leading-[1.1] tracking-tight ${i === 2 ? "text-[#C8FF00]" : "text-[#f0ece4]"}`}>
                  {part}
                </h3>
              </RevealText>
            ))}
          </div>

          {/* Right Column Supporting Description */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            {bodyLines.map((line, i) => (
              <RevealText key={i} delay={0.3 + i * 0.12}>
                <p className="font-satoshi font-normal text-[16px] text-[#6b6560] leading-relaxed">
                  {line}
                </p>
              </RevealText>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
