import React from "react";
import { motion } from "motion/react";
import experienceData from "../data/experience.json";

/* Edit src/data/experience.json to add/update experience entries. */

const experienceEntries = experienceData.entries;

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section
      id="experience-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        {/* Section label */}
        <div className="flex flex-col space-y-4">
          <RevealLine>
            <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
              Experience
            </span>
          </RevealLine>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Timeline */}
        <div className="relative w-full flex flex-col">
          {/* Vertical timeline line - hidden on mobile */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[40px] w-[1px] bg-[#1a1a1a] z-0 pointer-events-none" />

          <div className="flex flex-col space-y-10 md:space-y-16 mt-6">
            {experienceEntries.map((entry, index) => (
              <div key={index} className="relative w-full flex flex-col md:flex-row items-start gap-3 md:gap-0">
                
                {/* Dot on timeline - hidden on mobile */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1
                  }}
                  className="hidden md:block absolute left-[36.5px] top-[6px] w-2 h-2 rounded-full bg-[#C8FF00] z-10 shadow-[0_0_8px_rgba(200,255,0,0.5)] pointer-events-none"
                />

                {/* Horizontal connector from timeline dot to content - hidden on mobile */}
                <div className="hidden md:block absolute top-[9px] left-[40px] w-6 h-[1px] bg-[#1a1a1a] z-0 pointer-events-none" />

                {/* Year badge - mobile: inline tag, desktop: rotated on left */}
                <div className="md:absolute md:left-0 md:w-[40px] md:top-0 md:flex md:items-start md:justify-center md:pt-1 shrink-0">
                  <span className="font-mono text-[11px] text-[#C8FF00] bg-[#1a1a1a] md:bg-transparent border border-[#333] md:border-none px-2 md:px-0 py-0.5 md:py-0 rounded-sm md:rounded-none tracking-wider inline-block"
                    style={{
                      transform: "none",
                      transformOrigin: "center"
                    }}
                  >
                    {entry.years}
                  </span>
                </div>

                {/* Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15
                  }}
                  className="flex-1 md:pl-16 flex flex-col space-y-3 md:space-y-4"
                >
                  {/* Role + Type */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <div className="flex flex-col space-y-0.5">
                      <h3 className="font-satoshi font-bold text-[clamp(18px,2.5vw,32px)] text-[#f0ece4] leading-tight">
                        {entry.role}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="font-satoshi font-medium text-[14px] text-[#6b6560]">
                          {entry.company}
                        </span>
                        {entry.companyUrl && (
                          <a
                            href={entry.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="link"
                            className="text-[#C8FF00] hover:text-[#e4ff66] transition-colors inline-block text-[13px] leading-none"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <span className="self-start font-mono text-[10px] text-[#6b6560] tracking-widest bg-[#1a1a1a] border border-[#222222] px-2.5 py-1 rounded-[3px] select-none h-fit">
                      {entry.type}
                    </span>
                  </div>

                  {/* Bullets */}
                  <ul className="flex flex-col space-y-2">
                    {entry.bullets.map((bullet, idx) => (
                      <li 
                        key={idx}
                        className="font-satoshi font-normal text-[14px] md:text-[15px] text-[#6b6560] leading-[1.7] flex items-start gap-2.5"
                      >
                        <span className="text-[#C8FF00] select-none font-bold shrink-0 mt-[1px]">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
