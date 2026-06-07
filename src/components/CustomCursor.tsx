import React, { useEffect, useState, useRef } from "react";
import { FiMail, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  MAIL: FiMail,
  X: FaXTwitter,
  IN: FaLinkedinIn,
  GH: FaGithub,
  CV: FiFileText,
};

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const CURSOR_OFFSET_Y = 16;

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });

      const allElements = document.elementsFromPoint(e.clientX, e.clientY);
      let found = false;
      for (const el of allElements) {
        if ((el as HTMLElement).hasAttribute?.("data-cursor-element")) continue;
        const interactiveEl = (el as HTMLElement).closest?.("a, button, [data-cursor]");
        if (interactiveEl) {
          setHovered(true);
          const label = interactiveEl.getAttribute("data-cursor-label") || "";
          setCursorText(label);
          found = true;
          break;
        }
      }
      if (!found) {
        setHovered(false);
        setCursorText("");
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const showIcon = cursorText ? iconMap[cursorText] : undefined;
  const isIconLabel = !!showIcon;

  if (!isVisible) return null;

  return (
    <>
      <div
        id="custom-dot-cursor"
        data-cursor-element="true"
        className="fixed top-0 left-0 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y + CURSOR_OFFSET_Y}px`,
          width: hovered ? "68px" : "48px",
          height: hovered ? "68px" : "48px",
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: `translate3d(-50%, -50%, 0) scale(${clicked ? 0.85 : 1})`,
        }}
      >
        {isIconLabel && showIcon ? (
          <span className="text-white/80" style={{ fontSize: "18px" }}>
            {React.createElement(showIcon, { size: 18 })}
          </span>
        ) : (
          <img
            src="/mew-cursor.gif"
            alt="mew"
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{ imageRendering: "auto", transform: "translateY(25%)" }}
          />
        )}
      </div>

      {hovered && cursorText && (
        <div
          className="fixed pointer-events-none z-50 font-mono text-[11px] text-[#C8FF00] tracking-[0.15em] uppercase whitespace-nowrap"
          data-cursor-element="true"
          style={{
            left: `${position.x + 26}px`,
          top: `${position.y + CURSOR_OFFSET_Y}px`,
            transform: "translateY(-50%)",
          }}
        >
          {cursorText}
        </div>
      )}

      <div
        id="cursor-ambient-trail"
        data-cursor-element="true"
        className="fixed top-0 left-0 pointer-events-none z-45 rounded-full bg-accent-lime/10 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${cursorRef.current.x}px`,
          top: `${cursorRef.current.y + CURSOR_OFFSET_Y}px`,
          width: hovered ? "56px" : "40px",
          height: hovered ? "56px" : "40px",
          opacity: hovered ? 0.25 : 0.15,
          transition: "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
          transform: "translate3d(-50%, -50%, 0)",
        }}
      />
    </>
  );
}
