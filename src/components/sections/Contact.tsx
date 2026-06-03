import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import SectionMarker from '../ui/SectionMarker';
import Parallax from '../ui/Parallax';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Update IST Clock for extra high-fulfillment location metrics
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setLocalTime(timeString);
      } catch (e) {
        const now = new Date();
        setLocalTime(now.toTimeString().split(' ')[0]);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('siddharthreddy627@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const line1 = "LET'S BUILD";
  const line2 = "THE FUTURE.";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const charVariants = {
    hidden: { y: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
    visible: {
      y: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="bg-void px-6 md:px-12 pt-28 pb-16 relative select-none w-full border-b border-[#0f0f0f]" id="connect">
      {/* Absolute geometric layout elements */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#121212] to-transparent pointer-events-none" />
      <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#121212] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00FF55]/[0.012] rounded-full filter blur-[120px] pointer-events-none" />

      <SectionMarker number="04" label="CONNECT" />

      {/* Hero Headline Column */}
      <Parallax speed={0.35} className="w-full flex justify-center">
        <div className="flex flex-col items-center text-center mt-12 mb-12" id="contact-headline-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            className="flex flex-col items-center justify-center text-center select-all"
            id="contact-headline-box"
          >
            {/* Line 1 */}
            <div className="overflow-hidden h-[45px] sm:h-[75px] md:h-[110px]" id="climax-l1-overflow">
              <motion.div className="flex items-center justify-center font-display font-black text-[36px] sm:text-[64px] md:text-[90px] lg:text-[100px] text-text-primary tracking-[-0.04em] leading-none uppercase">
                {line1.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block transform origin-top select-none"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden h-[45px] sm:h-[75px] md:h-[110px] -mt-1 sm:-mt-2" id="climax-l2-overflow">
              <motion.div className="flex items-center justify-center font-display font-black text-[36px] sm:text-[64px] md:text-[90px] lg:text-[100px] text-signal tracking-[-0.04em] leading-none uppercase">
                {line2.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block transform origin-top select-none"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-mono text-[11px] sm:text-[12px] text-text-secondary tracking-wider max-w-[500px] leading-relaxed mt-6 text-center text-balance select-text"
            id="contact-subheading-lead"
          >
            LOOKING FOR FULL STACK & BACKEND ROLES IN EARLY-STAGE STARTUPS // ACTIVE AND READY FOR IMMEDIATE DEPLOYMENT
          </motion.p>
        </div>
      </Parallax>

      {/* Typographic Interactive Portals */}
      <div className="max-w-4xl mx-auto mt-6 flex flex-col gap-6" id="minimalist-channels">
        <div className="h-px bg-gradient-to-r from-transparent via-[#141414] to-transparent w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" id="minimal-links-grid">
          {/* Email Outbox */}
          <div 
            onClick={handleCopy}
            className="group flex flex-col items-center cursor-pointer transition-colors"
            id="link-smtp"
          >
            <span className="font-mono text-[9px] text-[#444] tracking-[0.2em] uppercase font-bold mb-2">// SMTP OUTBOX</span>
            <span className="font-mono font-medium text-xs sm:text-sm text-text-primary group-hover:text-signal transition-colors tracking-tight select-all">
              siddharthreddy627@gmail.com
            </span>
            <div className="h-4 mt-1 font-mono text-[9px] text-[#00FF55] uppercase tracking-wider select-none">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    COPIED
                  </motion.span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim">CLICK TO COPY</span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* GitHub Repository */}
          <a 
            href="https://github.com/siddreddy07"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center transition-colors"
            id="link-github"
          >
            <span className="font-mono text-[9px] text-[#444] tracking-[0.2em] uppercase font-bold mb-2">// GIT ENGINE</span>
            <span className="font-mono font-medium text-xs sm:text-sm text-text-primary group-hover:text-signal transition-colors tracking-tight flex items-center gap-1">
              github.com/siddreddy07
              <ArrowUpRight size={12} className="opacity-30 group-hover:opacity-100 group-hover:text-signal transition-all" />
            </span>
            <span className="font-mono text-[9px] text-[#444] h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider select-none">
              VIEW REPOS
            </span>
          </a>

          {/* LinkedIn Hub */}
          <a 
            href="https://www.linkedin.com/in/n-siddharth-reddy/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center transition-colors"
            id="link-linkedin"
          >
            <span className="font-mono text-[9px] text-[#444] tracking-[0.2em] uppercase font-bold mb-2">// NET GATEWAY</span>
            <span className="font-mono font-medium text-xs sm:text-sm text-text-primary group-hover:text-signal transition-colors tracking-tight flex items-center gap-1">
              linkedin.com/in/n-siddharth-reddy
              <ArrowUpRight size={12} className="opacity-30 group-hover:opacity-100 group-hover:text-signal transition-all" />
            </span>
            <span className="font-mono text-[9px] text-[#444] h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider select-none">
              CONNECT PROFILE
            </span>
          </a>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#141414] to-transparent w-full mt-2" />

        {/* Local Time Metric */}
        <div className="flex items-center justify-center gap-3 text-center mt-2 font-mono text-[10px] text-text-dim" id="loc-indicator">
          <span className="uppercase tracking-widest font-bold text-[#444]">HYDERABAD, IN</span>
          <span className="text-[#1a1a1a] select-none">//</span>
          <span className="uppercase tracking-wider font-semibold text-text-secondary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_6px_#00FF55]" />
            IST {localTime || 'ZONE'}
          </span>
        </div>
      </div>

    </section>
  );
}
