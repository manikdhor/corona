"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          "relative flex items-center gap-1 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
          scrolled
            ? "text-navy-700 hover:text-gold-600"
            : "text-cream/90 hover:text-gold-champagne"
        )}
        aria-label={label}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            open ? "rotate-180" : ""
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
            open ? "w-5" : "w-0 group-hover:w-5"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl bg-cream/95 backdrop-blur-xl shadow-gold border border-white/10"
          >
            <div className="p-2">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                      active
                        ? "bg-gold/10 text-gold-600"
                        : "text-navy-800 hover:bg-navy-50 hover:text-navy"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 text-[11px] text-navy-400 leading-snug">
                          {item.description}
                        </span>
                      )}
                    </div>
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