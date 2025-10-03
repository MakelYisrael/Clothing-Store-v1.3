import * as React from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const listener = () => setIsMobile(media.matches);
    try {
      media.addEventListener("change", listener);
    } catch {
      media.addListener(listener);
    }
    listener();
    return () => {
      try {
        media.removeEventListener("change", listener);
      } catch {
        media.removeListener(listener);
      }
    };
  }, [breakpoint]);

  return isMobile;
}
