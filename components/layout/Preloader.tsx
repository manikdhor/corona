"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="preloader-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="relative h-24 w-24">
              <Image
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                fill
                className="object-contain preloader-logo"
                priority
              />
            </div>
            <div className="mt-6 text-center">
              <p className="font-serif text-2xl font-bold text-cream tracking-wider">
                CORONA
              </p>
              <p className="text-xs uppercase tracking-[0.4em] text-gold mt-1">
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
