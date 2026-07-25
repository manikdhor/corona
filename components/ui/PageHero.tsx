"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  bgImage: string;
  align?: "left" | "center";
}

export default function PageHero({
  title,
  subtitle,
  breadcrumb,
  bgImage,
  align = "center",
}: PageHeroProps) {
  return (
    <section className="relative flex h-[55vh] min-h-[420px] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-navy opacity-90" />
        <div className="absolute inset-0 bg-navy/60" />
      </div>

      {/* Decorative ornament */}
      <div className="absolute top-10 left-10 h-20 w-20 border-l-2 border-t-2 border-gold/40 hidden md:block" />
      <div className="absolute bottom-10 right-10 h-20 w-20 border-r-2 border-b-2 border-gold/40 hidden md:block" />

      {/* Content */}
      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}
        >
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/60">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gold" />
            <span className="text-gold">{breadcrumb}</span>
          </nav>

          <h1 className="font-serif text-display-lg font-bold text-cream">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-relaxed text-cream/75">
              {subtitle}
            </p>
          )}

          <div className={cn("mt-8 flex", align === "center" ? "justify-center" : "justify-start")}>
            <div className="ornament-line">
              <span className="text-gold text-lg">◆</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
