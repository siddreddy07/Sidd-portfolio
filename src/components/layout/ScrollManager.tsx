import { useEffect } from "react";
import { useLocation } from "react-router";

// On route change: scroll to the requested home section (passed in router state, never in the URL), otherwise to the top.
export default function ScrollManager() {
  const { pathname, state } = useLocation();
  const section = (state as { section?: string } | null)?.section;

  useEffect(() => {
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView();
        window.history.replaceState({ ...window.history.state, usr: null }, "");
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, section]);

  return null;
}
