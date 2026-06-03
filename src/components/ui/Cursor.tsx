import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'work' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);

  // Magnetic attraction values
  const isMagnetic = useRef(false);
  const magnetTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if touch device
    const touchCheck = window.matchMedia('(pointer: coarse)');
    setIsCoarse(touchCheck.matches);
    
    const onTouchChange = (e: MediaQueryListEvent) => {
      setIsCoarse(e.matches);
    };
    touchCheck.addEventListener('change', onTouchChange);

    return () => {
      touchCheck.removeEventListener('change', onTouchChange);
    };
  }, []);

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Request Animation Frame loop for buttery 120Hz smooth movement
    let rafId: number;
    const updatePosition = () => {
      // Direct render for core (no lerp)
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Lerp for ring
      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (isMagnetic.current && magnetTarget.current) {
        const rect = magnetTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Attract toward center, with some limit
        const distanceX = targetX - centerX;
        const distanceY = targetY - centerY;
        
        // Attract ring completely to the center, or blend it
        targetX = centerX + distanceX * 0.25;
        targetY = centerY + distanceY * 0.25;
      }

      const dx = targetX - ringPos.current.x;
      const dy = targetY - ringPos.current.y;

      ringPos.current.x += dx * 0.15; 
      ringPos.current.y += dy * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    // Context-sensitive hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Is it a magnet target?
      const closestMagnet = target.closest('[data-magnet]');
      if (closestMagnet) {
        isMagnetic.current = true;
        magnetTarget.current = closestMagnet as HTMLElement;
        setCursorState('hover');
        return;
      } else {
        isMagnetic.current = false;
        magnetTarget.current = null;
      }

      // 2. Is it a work element?
      const closestWork = target.closest('[data-cursor="work"]');
      if (closestWork) {
        setCursorState('work');
        return;
      }

      // 3. Simple clickables (links, buttons, action nodes)
      const closestLink = target.closest('a, button, [role="button"], input, textarea, select');
      if (closestLink) {
        setCursorState('hover');
        return;
      }

      // 4. Pure textual readable blocks
      const closestText = target.closest('p, blockquote, pre, code');
      if (closestText) {
        setCursorState('text');
        return;
      }

      setCursorState('default');
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;
  
  const stateClasses = {
    default: {
      core: 'w-[4px] h-[4px] bg-signal -mt-[2px] -ml-[2px]',
      ring: 'w-[32px] h-[32px] -mt-[16px] -ml-[16px] border border-signal/25'
    },
    hover: {
      core: 'w-0 h-0 opacity-0',
      ring: 'w-[48px] h-[48px] -mt-[24px] -ml-[24px] border border-signal bg-signal/10'
    },
    work: {
      core: 'w-0 h-0 opacity-0',
      ring: 'w-[76px] h-[76px] -mt-[38px] -ml-[38px] border border-signal bg-signal/15 flex items-center justify-center scale-105'
    },
    text: {
      core: 'w-[2px] h-[2px] bg-signal/80 -mt-[1px] -ml-[1px]',
      ring: 'w-[20px] h-[20px] -mt-[10px] -ml-[10px] border border-signal/20 bg-white/2'
    }
  };

  return (
    <div className="hidden md:block">
      {/* Outer follow-up ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full transition-all duration-[240ms] ease-out z-[9997] flex items-center justify-center ${stateClasses[cursorState].ring}`}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        id="cursor-ring"
      >
        {cursorState === 'work' && (
          <span className="font-mono text-[9px] font-semibold text-signal tracking-[0.1em] select-none scale-90 animate-pulse">
            VIEW
          </span>
        )}
      </div>

      {/* Center pinpoint core */}
      <div
        ref={coreRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full transition-all duration-150 z-[9998] ${stateClasses[cursorState].core}`}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        id="cursor-core"
      />
    </div>
  );
}
