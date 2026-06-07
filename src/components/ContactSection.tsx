import React from "react";
import { motion } from "motion/react";

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col space-y-4">
          <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
            Contact
          </span>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Dynamic Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          
          {/* Left Column Statement */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-[clamp(32px,5.5vw,64px)] text-[#f0ece4] leading-[1.1] tracking-tight"
            >
              Have a project in mind? Let's build systems that scale.
            </motion.h3>

            {/* Pulsing Status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" style={{ animationDuration: "2s" }} />
              <span className="font-satoshi text-[14px] text-[#6b6560] tracking-wide">
                Currently open for roles & architectural consulting globally
              </span>
            </motion.div>
          </div>

          {/* Right Column Contact Links */}
          <div className="lg:col-span-5 flex flex-col justify-end space-y-6 pt-4 lg:pt-0">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col space-y-4 select-text"
            >
              {/* Email Link */}
              <div className="relative group self-start">
                <a
                  href="mailto:siddharthreddy627@gmail.com"
                  data-cursor="link"
                  className="block font-satoshi font-medium text-[16px] text-[#f0ece4] hover:text-[#C8FF00] transition-colors duration-200 py-1"
                >
                  siddharthreddy627@gmail.com
                </a>
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8FF00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out pointer-events-none" />
              </div>

              {/* Phone Link */}
              <div className="relative group self-start">
                <a
                  href="tel:8101421758"
                  data-cursor="link"
                  className="block font-satoshi font-medium text-[16px] text-[#f0ece4] hover:text-[#C8FF00] transition-colors duration-200 py-1"
                >
                  8101421758
                </a>
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8FF00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out pointer-events-none" />
              </div>

              {/* LinkedIn Link */}
              <div className="relative group self-start">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="block font-satoshi font-medium text-[16px] text-[#f0ece4] hover:text-[#C8FF00] transition-colors duration-200 py-1"
                >
                  LinkedIn ↗
                </a>
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8FF00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out pointer-events-none" />
              </div>

              {/* Resume / CV Link */}
              <div className="relative group self-start">
                <a
                  href="https://drive.google.com/file/d/14DLmQ6Ae6c3exodWqsWr-orEsfRbGid9/view?usp=drivesdk"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="block font-satoshi font-medium text-[16px] text-[#f0ece4] hover:text-[#C8FF00] transition-colors duration-200 py-1"
                >
                  Resume / CV ↗
                </a>
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8FF00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out pointer-events-none" />
              </div>

              {/* Location Detail */}
              <div className="pt-2">
                <span className="font-mono text-[10px] text-[#6b6560] uppercase tracking-[0.08em] select-none">
                  Visakhapatnam, India → Remote Friendly
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="flex flex-col space-y-6 pt-16">
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono select-none text-[10px] text-[#6b6560]">
            <div>
              <span className="font-satoshi font-medium text-xs text-[#6b6560]">
                N. Siddharth Reddy · Backend Engineer
              </span>
            </div>
            <div>
              <span>Built with React · Framer Motion · Lenis</span>
            </div>
            <div>
              <span>© 2025</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
