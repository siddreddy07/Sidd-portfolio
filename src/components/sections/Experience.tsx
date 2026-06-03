import { motion } from 'motion/react';
import SectionMarker from '../ui/SectionMarker';
import Parallax from '../ui/Parallax';
import { EXPERIENCE } from '../../data';

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="bg-void px-6 md:px-12 py-24 select-text" id="work-log">
      <SectionMarker number="04" label="LOG" />

      <div className="flex justify-between items-center pb-6 border-b border-[#1e1e1e] mt-12 mb-8 select-none" id="log-list-header">
        <h3 className="font-display font-bold text-[13px] tracking-[0.25em] text-text-primary uppercase">
          WORK LOG ENTRIES
        </h3>
        <span className="font-mono text-[11px] text-[#444] uppercase tracking-wider font-semibold">
          {EXPERIENCE.length.toString().padStart(2, '0')} INTERNSHIPS COMPLETED
        </span>
      </div>

      {/* Experience Entries Stack */}
      <div className="relative flex flex-col w-full" id="experience-vertical-timeline">
        {EXPERIENCE.map((entry, index) => {
          return (
            <motion.div
              key={entry.id}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative py-12 ${
                index < EXPERIENCE.length - 1 ? 'border-b border-[#1e1e1e]' : ''
              }`}
              id={`exp-row-${entry.id}`}
            >
              {/* TIMELINE COLUMN */}
              <Parallax speed={-0.12} className="md:col-span-4 select-text">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col md:pr-6 relative"
                  id={`exp-timeline-col-${entry.id}`}
                >
                  {/* Timeline node/dot */}
                  <div className="hidden md:flex absolute top-1.5 -left-4 items-center justify-center z-10" id={`exp-node-${entry.id}`}>
                    <div className="w-[6px] h-[6px] rounded-full bg-signal" />
                  </div>

                  <h4 className="font-display font-bold text-base sm:text-lg text-text-primary tracking-tight leading-snug">
                    {entry.company}
                  </h4>
                  <span className="font-mono text-[11px] text-[#3a3936] font-semibold mt-1 tracking-widest uppercase">
                    {entry.date}
                  </span>
                </motion.div>
              </Parallax>

              {/* CONTENT COLUMN */}
              <Parallax speed={0.15} className="md:col-span-8 select-text">
                <div className="flex flex-col gap-6" id={`exp-content-col-${entry.id}`}>
                  {/* Role Title */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-1"
                    id={`exp-role-hub-${entry.id}`}
                  >
                    <span className="font-mono text-[11px] font-bold text-signal/40 tracking-widest uppercase select-none">
                      [ POSITION ]
                    </span>
                    <p className="font-mono text-[13px] font-semibold text-[#00ff55] uppercase tracking-wider select-all">
                      {entry.title}
                    </p>
                  </motion.div>

                  {/* Bullets with Commit-style "feat:" syntax */}
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-col gap-3 font-mono text-[12px] text-text-secondary leading-relaxed"
                    id={`exp-bullets-${entry.id}`}
                  >
                    {entry.bullets.map((bullet, bIdx) => {
                      const hasCommitPrefix = bullet.startsWith('feat:') || bullet.startsWith('fix:');
                      const text = hasCommitPrefix ? bullet.substring(5) : bullet;
                      
                      return (
                        <motion.div
                          key={bIdx}
                          variants={itemVariants}
                          className="flex items-start gap-3"
                          id={`exp-bullet-${entry.id}-${bIdx}`}
                        >
                          <span className="text-signal/80 select-none font-bold mt-1">→</span>
                          <div>
                            <span className="text-signal font-semibold mr-1.5 select-none hover:text-signal/85">feat:</span>
                            <span className="text-text-secondary/90 select-all">{text}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </Parallax>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

