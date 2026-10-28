"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
}

export default function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isAnyChildActive = items.some((item) => isActive(item.href));

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
          open || isAnyChildActive
            ? "text-gold-300 bg-white/[0.05]"
            : "text-cream/80 hover:text-cream hover:bg-white/[0.04]"
        )}
        aria-label={label}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-300 text-gold-400/80",
            open ? "rotate-180 text-gold-300" : ""
          )}
        />
        {/* Subtle illuminated indicator */}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 shadow-[0_0_8px_rgba(201,169,110,0.8)] transition-all duration-400",
            open || isAnyChildActive ? "w-5" : "w-0"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-64 overflow-hidden rounded-2xl bg-[#081329]/95 backdrop-blur-2xl border border-gold-500/25 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
          >
            {/* Ambient luxury top highlight rim */}
            <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all duration-200 border-l-2",
                      active
                        ? "bg-gradient-to-r from-gold-500/20 to-transparent text-gold-200 border-gold-400 font-semibold"
                        : "border-transparent text-cream/75 hover:bg-gradient-to-r hover:from-white/[0.06] hover:to-transparent hover:text-cream hover:border-gold-500/40"
                    )}
                  >
                    <div className="flex flex-col pr-2">
                      <span className="text-[12.5px] font-medium tracking-wide">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 text-[10.5px] text-cream/40 leading-snug group-hover:text-cream/65">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-3 w-3 shrink-0 text-gold-400 opacity-0 -translate-x-1.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
