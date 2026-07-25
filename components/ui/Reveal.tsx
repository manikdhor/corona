"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

/**
 * Reveal — client wrapper around motion.div for scroll-triggered animations.
 * Use this in server components (pages with metadata exports) instead of motion.div.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 40,
  duration = 0.8,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
