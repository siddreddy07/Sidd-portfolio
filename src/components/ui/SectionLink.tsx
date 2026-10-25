import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { scrollToSection } from "../../lib/scroll";

// An in-page link that scrolls to a home section and leaves the URL alone.
export default function SectionLink({
  id,
  className,
  onNavigate,
  children,
  ...rest
}: {
  id: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
  "aria-current"?: "location";
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <a
      href="/"
      className={className}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        scrollToSection(id, navigate, pathname);
      }}
    >
      {children}
    </a>
  );
}
