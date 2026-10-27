"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Image, Mail, Menu, Phone } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNavigationAction, getSettingsAction } from "@/lib/admin/actions";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Building2 },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "More", href: "#", icon: Menu },
] as const;

interface BottomNavProps {
  adminNavLinks?: { label: string; href: string }[];
  adminPhone?: string;
  initialNavLinks?: { label: string; href: string }[];
  initialPhone?: string;
}

export default function BottomNav({
  adminNavLinks,
  adminPhone,
  initialNavLinks,
  initialPhone,
}: BottomNavProps = {}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[] | null>(
    initialNavLinks || adminNavLinks || null
  );
  const [phone, setPhone] = useState<string | null>(() => {
    const raw = initialPhone || adminPhone;
    return raw ? raw.replace(/[^0-9+]/g, "") : null;
  });

  useEffect(() => {
    if (initialNavLinks) setNavLinks(initialNavLinks);
  }, [initialNavLinks]);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone.replace(/[^0-9+]/g, ""));
  }, [initialPhone]);

  useEffect(() => {
    if (!initialNavLinks && !adminNavLinks) {
      getNavigationAction().then((nav) => {
        if (nav?.header && nav.header.length > 0) {
          setNavLinks(nav.header);
        }
      });
    }
    if (!initialPhone && !adminPhone) {
      getSettingsAction().then((settings) => {
        if (settings?.company?.phone) {
          const raw = settings.company.phone.replace(/[^0-9+]/g, "");
          setPhone(raw);
        }
      });
    }
  }, [adminNavLinks, adminPhone, initialNavLinks, initialPhone]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Admin-first: use prop > fetched > hardcoded fallback
  const effectiveNav = navLinks || adminNavLinks;
  const navSource = effectiveNav && effectiveNav.length > 0 ? effectiveNav : NAV_LINKS;
  const secondaryLinks = navSource.filter(
    (l) => !TABS.some((t) => t.href === l.href)
  );
  const phoneRaw = phone || adminPhone || CONTACT_INFO.phoneRaw;

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "md:hidden",
          "bg-cream/90 backdrop-blur-2xl",
          "border-t border-navy-100/60",
          "pb-[env(safe-area-inset-bottom)]"
        )}
      >
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            if (tab.label === "More") {
              return (
                <button
                  key={tab.href}
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors",
                    moreOpen ? "text-gold" : "text-navy-300"
                  )}
                  aria-label="More options"
                >
                  <tab.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors",
                  active ? "text-gold" : "text-navy-300"
                )}
              >
                <tab.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* More overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-navy-950/50 backdrop-blur-sm md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden"
            >
              <div className="mb-4 h-1 w-12 rounded-full bg-navy-200 mx-auto" />
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-400 mb-4">
                More
              </p>
              <div className="grid grid-cols-2 gap-3">
                 {secondaryLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-gold/10 text-gold"
                          : "bg-navy-50 text-navy hover:bg-navy-100"
                      )}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-navy-400">
                        {link.label.charAt(0)}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-gold px-4 py-3.5 text-sm font-bold text-navy shadow-gold"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
