import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Binary,
  Database,
  Blocks,
  Cpu,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SectionMarker from '../ui/SectionMarker';
import Parallax from '../ui/Parallax';
import { STACK_MANIFEST } from '../../data';

interface StackCategoryCardProps {
  category: string;
  subs: Record<string, string[]>;
  idx: number;
  config: {
    label: string;
    text: string;
    bg: string;
    border: string;
    icon: any;
  };
  speedFactor: number;
  isOpen: boolean;
  onToggle: () => void;
  key?: string | number;
}

function StackCategoryCard({ category, subs, idx, config, speedFactor, isOpen, onToggle }: StackCategoryCardProps) {
  return (
    <Parallax key={category} speed={speedFactor} className="w-full flex flex-col">
      <div
        className={`flex flex-col bg-[#050505] border border-[#141414] rounded-[5px] p-6 lg:p-7 hover:border-signal/30 transition-all duration-300 relative overflow-hidden`}
        id={`cat-card-${category}`}
      >
        {/* Subtle top accent ambient band matching category color */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${config.border} bg-current ${config.text} opacity-20`} />

        {/* Category Header Row - serves as toggle trigger */}
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full pb-4 border-b border-[#121212] cursor-pointer select-none text-left border-none bg-transparent"
          id={`cat-head-${category}`}
        >
          <div className="flex items-center gap-2.5">
            {config.icon}
            <h4 className="font-display font-black text-sm tracking-widest text-text-primary uppercase">
              {config.label}
            </h4>
          </div>
          <div className="text-[#333] hover:text-signal/80 transition-colors">
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {/* Subcategories & Skill Groups */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? 20 : 0
          }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-6 text-left" id={`cat-body-${category}`}>
            {Object.entries(subs).map(([subKey, items]) => {
              const isMobileSub = category === 'frontend' && subKey === 'mobile';
              return (
                <div
                  key={subKey}
                  className={`flex flex-col gap-2.5 text-left relative ${
                    isMobileSub ? 'group/mobile-sec p-2 -m-2 rounded-sm border border-transparent hover:border-signal/20 hover:bg-[#080808]/40 transition-all duration-300' : ''
                  }`}
                  id={`sub-group-${category}-${subKey}`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${
                        isMobileSub ? 'text-signal flex items-center gap-1.5' : 'text-text-dim'
                      }`}
                    >
                      // {subKey.replace(/([A-Z])/g, '_$1').toUpperCase()}
                      {isMobileSub && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal"></span>
                        </span>
                      )}
                    </span>

                    {/* Interactive tooltip shown upon hover over the mobile area */}
                    {isMobileSub && (
                      <div className="opacity-0 group-hover/mobile-sec:opacity-100 transition-all duration-300 absolute -top-8 left-0 z-20 pointer-events-none bg-signal/15 border border-signal/30 text-signal font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-[0_4px_12px_rgba(0,255,85,0.15)] backdrop-blur-sm whitespace-nowrap">
                        GRASPING CONTENT // LEARNING & ADAPTING
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2" id={`sub-items-${category}-${subKey}`}>
                    {items.map((item) => (
                      <span
                        key={item}
                        className={`px-3 py-1.5 font-mono text-[11.5px] rounded-[3px] transition-all duration-200 uppercase ${
                          isMobileSub
                            ? 'text-signal bg-signal/5 border border-signal/25 hover:text-signal hover:border-signal/50 hover:bg-[#080808]'
                            : 'text-text-secondary bg-void border border-[#121212] hover:text-signal hover:border-signal/25 hover:bg-[#070707]'
                        }`}
                        id={`skill-tag-${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Parallax>
  );
}

export default function Stack() {
  const allCategories = Object.keys(STACK_MANIFEST);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(allCategories));

  // Map tech categories to icons, labels, and color guidelines
  const categoryHeaders: Record<string, { label: string; text: string; bg: string; border: string; icon: any }> = {
    runtime: {
      label: 'ENGINES & RUNTIMES',
      text: 'text-green-400',
      bg: 'bg-green-500/5',
      border: 'border-green-500/10',
      icon: <Binary size={16} className="text-green-400" />,
    },
    database: {
      label: 'STORAGE & DATABASES',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/10',
      icon: <Database size={16} className="text-emerald-400" />,
    },
    frontend: {
      label: 'CLIENT SIDE CORE',
      text: 'text-teal-400',
      bg: 'bg-teal-500/5',
      border: 'border-teal-500/10',
      icon: <Blocks size={16} className="text-teal-400" />,
    },
    infrastructure: {
      label: 'INFRA & SERVICES',
      text: 'text-blue-400',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/10',
      icon: <Cpu size={16} className="text-blue-400" />,
    },
    integrations: {
      label: 'SYSTEM & CLOUD INTEGRATIONS',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/10',
      icon: <Sparkles size={16} className="text-yellow-400" />,
    },
  };

  return (
    <section className="bg-void px-6 md:px-12 py-24 select-none" id="manifest">
      <SectionMarker number="03" label="STACK" />

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mt-12 mb-12 border-b border-[#141414]" id="stack-header">
        <div className="flex flex-col gap-1.5 animate-fade-in text-left">
          <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
            TECHNICAL CORES
          </h3>
          <p className="font-mono text-[10px] sm:text-[11px] text-text-dim uppercase tracking-widest">
            ENGINEERING STACK // INTEGRATED TECHNOLOGIES & TOOLS
          </p>
        </div>
      </div>

      {/* Bento Grid Layout of Skills Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start" id="stack-categories-grid">
        {Object.entries(STACK_MANIFEST).map(([category, subs], idx) => {
          const config = categoryHeaders[category] || {
            label: category.toUpperCase(),
            text: 'text-text-primary',
            bg: 'bg-[#080808]',
            border: 'border-[#141414]',
            icon: <Cpu size={16} />
          };

          // Distribute different floating rates
          const driftRates = [-0.25, 0.35, -0.15, 0.25, -0.3];
          const speedFactor = driftRates[idx % driftRates.length];

          return (
            <StackCategoryCard
              key={category}
              category={category}
              subs={subs}
              idx={idx}
              config={config}
              speedFactor={speedFactor}
              isOpen={activeCategories.has(category)}
              onToggle={() => {
                const next = new Set(activeCategories);
                next.has(category) ? next.delete(category) : next.add(category);
                setActiveCategories(next);
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
