import React from "react";
import { motion } from "motion/react";

interface TimelineEntry {
  years: string;
  role: string;
  company: string;
  companyUrl?: string;
  type: "INTERNSHIP" | "EDUCATION";
  bullets: string[];
}

const experienceEntries: TimelineEntry[] = [
  {
    years: "2025",
    role: "MERN Stack Dev Intern",
    company: "TEN",
    companyUrl: "https://github.com/hrxsiddharth",
    type: "INTERNSHIP",
    bullets: [
      "Built 6+ HRMS API endpoints with JWT auth and RBAC",
      "Shipped React features tied to backend modules",
      "Contributed to production codebase serving real users"
    ]
  },
  {
    years: "2024",
    role: "Backend Dev Intern",
    company: "reaidy.io",
    companyUrl: "https://github.com/hrxsiddharth",
    type: "INTERNSHIP",
    bullets: [
      "Hardened auth with httpOnly cookies, Redis rate limiting",
      "Wrote MongoDB aggregation pipelines for analytics",
      "Reduced API attack surface through input validation"
    ]
  },
  {
    years: "2021—2025",
    role: "B.Tech Computer Science & Engineering",
    company: "Andhra University College of Engineering",
    type: "EDUCATION",
    bullets: [
      "CGPA: 7.99",
      "Graduated April 2025"
    ]
  }
];

export default function ExperienceSection() {
  return (
    <section
      id="experience-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        {/* Section label */}
        <div className="flex flex-col space-y-4">
          <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
            Experience
          </span>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Timeline body with the vertical line */}
        <div className="relative w-full flex flex-col">
          {/* Vertical 1px #1a1a1a line positioned exactly 40px from the left on desktop, 24px on mobile */}
          <div className="absolute top-0 bottom-0 left-[24px] md:left-[40px] w-[1px] bg-[#1a1a1a] z-0 pointer-events-none" />

          {/* Timeline points stack */}
          <div className="flex flex-col space-y-16 mt-6">
            {experienceEntries.map((entry, index) => {
              return (
                <div key={index} className="relative w-full flex flex-col md:flex-row items-start">
                  
                  {/* Dot precisely on the vertical timeline intersection with scale animations */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.1
                    }}
                    className="absolute left-[20px] md:left-[36.5px] top-[14px] w-2 h-2 rounded-full bg-[#C8FF00] z-10 shadow-[0_0_8px_rgba(200,255,0,0.5)] pointer-events-none"
                  />

                  {/* Horizontal rule from timeline line spanning outwards to full width */}
                  <div className="absolute top-[17.5px] left-[24px] md:left-[40px] right-0 h-[1px] bg-[#1a1a1a] z-0 pointer-events-none" />

                  {/* LEFT columns: Year range vertically centered and rotated 90deg */}
                  <div className="w-[48px] h-9 flex items-center justify-center z-10 shrink-0 pointer-events-none select-none">
                    <span 
                      className="font-mono text-[10px] text-[#6b6560] uppercase tracking-wider block whitespace-nowrap"
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "center"
                      }}
                    >
                      {entry.years}
                    </span>
                  </div>

                  {/* RIGHT columns: Main Content Box with 48px padding-left and viewport entrance delay */}
                  <motion.div
                    initial={{ y: 24, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15
                    }}
                    className="flex-1 pl-8 md:pl-12 flex flex-col space-y-4 pt-1"
                  >
                    {/* Header: Role Title & type tag */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-satoshi font-bold text-[clamp(20px,3vw,36px)] text-[#f0ece4] leading-tight">
                          {entry.role}
                        </h3>
                        <div className="flex items-center gap-1.5 h-6">
                          <span className="font-satoshi font-medium text-15px text-[#6b6560]">
                            {entry.company}
                          </span>
                          {entry.companyUrl && (
                            <a
                              href={entry.companyUrl}
                              target="_blank"
                              rel="noreferrer"
                              data-cursor="link"
                              className="text-[#C8FF00] hover:text-[#e4ff66] transition-colors inline-block text-[14px] leading-none"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Internship or Education label pill */}
                      <span className="self-start md:self-center font-mono text-[10px] text-[#6b6560] tracking-widest bg-[#1a1a1a] border border-[#222222] px-2.5 py-1 rounded-[3px] select-none h-fit">
                        {entry.type}
                      </span>
                    </div>

                    {/* Achievements List */}
                    <ul className="flex flex-col space-y-2 mt-2">
                      {entry.bullets.map((bullet, idx) => (
                        <li 
                          key={idx}
                          className="font-satoshi font-normal text-[15px] text-[#6b6560] leading-[1.7] flex items-start gap-3"
                        >
                          <span className="text-[#C8FF00] select-none font-bold">—</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
