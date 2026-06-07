import React from "react";
import { motion } from "motion/react";
import { FiMail, FiFileText } from "react-icons/fi";
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number; key?: string | number }) {
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

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 md:py-28 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-14 md:space-y-20">

        {/* Section Header */}
        <div className="flex flex-col space-y-4">
          <RevealLine>
            <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-[0.15em] select-none">
              Contact
            </span>
          </RevealLine>
          <div className="w-full h-[1px] bg-[#1a1a1a]" />
        </div>

        {/* Heading */}
        <div className="flex flex-col space-y-2">
          <RevealLine>
            <h2 className="font-display italic text-[clamp(40px,7vw,96px)] text-[#f0ece4] leading-[1] tracking-tight">
              Have a project
            </h2>
          </RevealLine>
          <RevealLine delay={0.1}>
            <h2 className="font-display italic text-[clamp(40px,7vw,96px)] text-[#f0ece4] leading-[1] tracking-tight">
              in mind?
            </h2>
          </RevealLine>
          <RevealLine delay={0.2}>
            <h2 className="font-display italic text-[clamp(40px,7vw,96px)] text-[#C8FF00] leading-[1] tracking-tight">
              Let's talk.
            </h2>
          </RevealLine>
        </div>

        {/* Email */}
        <div className="flex justify-end">
          <RevealLine delay={0.3}>
            <a
              href="mailto:siddharthreddy627@gmail.com"
              data-cursor="link"
              data-cursor-label="MAIL"
              className="group inline-flex items-center gap-2.5 font-satoshi font-medium text-[16px] md:text-[18px] text-[#f0ece4] hover:text-[#C8FF00] transition-colors"
            >
              <span className="text-[#6b6560] group-hover:text-[#C8FF00] transition-colors"><FiMail size={15} /></span>
              siddharthreddy627@gmail.com
            </a>
          </RevealLine>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#1a1a1a]" />

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-0">
          {[
            { label: "GitHub", href: "https://github.com/siddreddy07", value: "siddreddy07", cursor: "GH", icon: FaGithub },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/n-siddharth-reddy/", value: "n-siddharth-reddy", cursor: "IN", icon: FaLinkedinIn },
            { label: "X (Twitter)", href: "https://x.com/siddreddy007", value: "@siddreddy007", cursor: "X", icon: FaXTwitter },
          ].map((link, i) => (
            <RevealLine key={link.label} delay={0.4 + i * 0.08}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label={link.cursor}
                className="group flex items-center gap-3 py-4 md:py-0 border-b md:border-b-0 border-[#1a1a1a]"
              >
                <span className="text-[#6b6560] group-hover:text-[#C8FF00] transition-colors text-[16px] w-5 shrink-0">
                  <link.icon />
                </span>
                <span className="font-satoshi font-medium text-[15px] md:text-[14px] text-[#f0ece4] group-hover:text-[#C8FF00] transition-colors flex-1">
                  {link.value}
                </span>
                <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  {link.label}
                  <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                </span>
              </a>
            </RevealLine>
          ))}
        </div>


      </div>
    </section>
  );
}
