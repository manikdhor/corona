"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress on navigation change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(hideTimer);
    }
  }, [pathname]);

  // Intercept internal link clicks to provide instant visual feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const isTargetBlank = target.getAttribute("target") === "_blank";
      const isDownload = target.hasAttribute("download");

      if (!href || isTargetBlank || isDownload) return;

      // Only handle internal navigation links
      if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/#")) {
        const url = new URL(href, window.location.origin);
        // If clicking link to current exact URL without hash change, ignore
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }

        // Start luxury loading bar
        setVisible(true);
        setProgress(30);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 85;
            }
            return prev + (prev < 60 ? 15 : 5);
          });
        }, 150);
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[99999] h-[2.5px] overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 shadow-[0_0_12px_rgba(201,169,110,0.9)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
