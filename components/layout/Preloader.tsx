"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { normalizeImageUrl } from "@/lib/utils";

export default function Preloader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const hasVisited = sessionStorage.getItem("corona_preloader_seen");
      if (hasVisited) {
        return;
      }
      setLoading(true);
      sessionStorage.setItem("corona_preloader_seen", "1");
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="preloader-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="relative h-20 w-20" style={{ position: "relative" }}>
              <Image
                src={normalizeImageUrl(SITE_CONFIG.logo)}
                alt={SITE_CONFIG.name}
                fill
                sizes="80px"
                className="object-contain preloader-logo"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-serif text-xl font-bold text-cream tracking-wider">
                CORONA
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mt-1">
                Properties Limited
              </p>
            </div>
            <div className="preloader-bar" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
