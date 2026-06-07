/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable custom cursor if it's a device with a hover-capable pointer
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Dynamic delegate listening for any element with design hover instructions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers for any link, button, or custom data-cursor elements
      const interactiveEl = target.closest("a, button, [data-cursor]");
      
      if (interactiveEl) {
        setHovered(true);
        const label = interactiveEl.getAttribute("data-cursor-label") || "";
        setCursorText(label);
      } else {
        setHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    // Buttery-smooth lerp loop for the cursor follow-effect with exactly 0.12 lag
    // Matches the required premium motion feel with absolute precision
    const renderCursor = () => {
      setPosition((prev) => {
        const dx = cursorRef.current.x - prev.x;
        const dy = cursorRef.current.y - prev.y;
        
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });
      requestRef.current = requestAnimationFrame(renderCursor);
    };

    requestRef.current = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central kinetic cursor */}
      <div
        id="custom-dot-cursor"
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: hovered ? "36px" : "8px",
          height: hovered ? "36px" : "8px",
          backgroundColor: hovered ? "transparent" : "#C8FF00",
          border: hovered ? "1.5px solid #C8FF00" : "0px solid transparent",
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: `translate3d(-50%, -50%, 0) scale(${clicked ? 0.85 : 1})`,
        }}
      >
        {hovered && cursorText && (
          <div
            id="cursor-text-indicator"
            className="absolute inset-0 flex items-center justify-center font-mono text-[9px] tracking-widest text-[#C8FF00] font-medium"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s ease 0.1s",
            }}
          >
            {cursorText}
          </div>
        )}
      </div>

      {/* Subtle background ambient trail dot */}
      <div
        id="cursor-ambient-trail"
        className="fixed top-0 left-0 pointer-events-none z-45 rounded-full bg-accent-lime/10 transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{
          left: `${cursorRef.current.x}px`,
          top: `${cursorRef.current.y}px`,
          width: "24px",
          height: "24px",
          opacity: hovered ? 0 : 0.4,
          transition: "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
          transform: "translate3d(-50%, -50%, 0)",
        }}
      />
    </>
  );
}
