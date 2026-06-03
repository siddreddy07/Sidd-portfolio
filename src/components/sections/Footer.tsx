import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="bg-void px-6 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center select-none max-w-6xl mx-auto w-full border-t border-[#0d0d0d]"
      id="site-footer"
    >
      {/* Dynamic low contrast signature */}
      <div className="flex items-center gap-2 font-mono text-[10px] text-text-dim/80" id="footer-left-sig">
        <span className="font-bold tracking-widest text-[#444] uppercase">
          N. SIDDHARTH REDDY © 2026
        </span>
        <span className="text-[#2c2b29] select-none">//</span>
        <span className="tracking-wider uppercase">
          SOFTWARE SYSTEMS
        </span>
      </div>

      {/* Return to top interaction point */}
      <a 
        href="#applet-root"
        className="font-mono text-[9px] text-[#2c2b29] hover:text-signal tracking-[0.15em] uppercase font-bold transition-all duration-300 flex items-center gap-1.5"
        id="btn-footer-back-to-top"
      >
        <span>BACK TO TOP</span>
        <ArrowUpRight size={10} className="opacity-60" />
      </a>
    </footer>
  );
}
