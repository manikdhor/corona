"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Diamond, Mail, ChevronDown } from "lucide-react";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import NavDropdown from "@/components/ui/NavDropdown";
import { cn, normalizeImageUrl } from "@/lib/utils";
import { getNavigationAction, getSettingsAction } from "@/lib/admin/actions";
import { AdminNavigation } from "@/lib/admin/seed";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Dynamic Navigation & Company settings
  const [navData, setNavData] = useState<AdminNavigation | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: SITE_CONFIG.name,
    shortName: SITE_CONFIG.shortName,
    logo: SITE_CONFIG.logo,
    phone: CONTACT_INFO.phone,
    phoneRaw: CONTACT_INFO.phoneRaw,
    email: CONTACT_INFO.email,
    ctaText: "Book a Visit",
    ctaLink: "/contact",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    // Fetch dynamic navigation
    getNavigationAction().then((nav) => {
      if (nav) setNavData(nav);
    });

    // Fetch dynamic company info
    getSettingsAction().then((s) => {
      if (s?.company) {
        setCompanyInfo((prev) => ({
          ...prev,
          name: s.company.name || prev.name,
          shortName: s.company.shortName || prev.shortName,
          logo: s.company.logo || prev.logo,
          phone: s.company.phone || prev.phone,
          phoneRaw: (s.company.phone || prev.phone).replace(/[^0-9+]/g, ""),
          email: s.company.email || prev.email,
          ctaText: s.company.ctaText || prev.ctaText,
          ctaLink: s.company.ctaLink || prev.ctaLink,
        }));
      }
    });
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Properties dropdown items exactly matching live project
  const propertyDropdownItems = PROJECTS.map((p) => ({
    label: p.name,
    href: `/projects/${p.slug}`,
  }));

  const headerLinks =
    navData?.header && navData.header.length > 0
      ? navData.header
      : [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Properties", href: "/projects" },
          { label: "Gallery", href: "/gallery" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/contact" },
        ];

  return (
    <>
      {/* === MOBILE NAVBAR === */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-600 md:hidden",
          scrolled
            ? "bg-cream/90 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(201,169,110,0.15),0_8px_40px_rgba(10,26,62,0.06)]"
            : "bg-navy-950/70 backdrop-blur-lg"
        )}
      >
        <nav className="flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label={companyInfo.name}>
            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white/10 p-1" style={{ position: "relative" }}>
              <Image
                src={normalizeImageUrl(companyInfo.logo)}
                alt={companyInfo.name}
                fill
                className="object-contain"
                priority
                sizes="36px"
              />
            </div>
            <div className="flex items-center gap-2 leading-none">
              <span
                className={cn(
                  "font-serif text-sm font-bold tracking-wide transition-colors duration-500",
                  scrolled ? "text-navy" : "text-cream"
                )}
              >
                Corona
              </span>
              <span className="h-3 w-px bg-gold-500/40" />
              <span
                className={cn(
                  "text-[8px] uppercase tracking-[0.25em] font-semibold transition-colors duration-500",
                  scrolled ? "text-gold-600" : "text-gold-champagne"
                )}
              >
                Properties
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all",
              scrolled
                ? "text-navy hover:bg-navy-50"
                : "text-cream hover:bg-white/15"
            )}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </nav>
        <div
          className={cn(
            "h-px w-full transition-opacity duration-600",
            scrolled
              ? "bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-100"
              : "opacity-0"
          )}
        />
      </header>

      {/* === DESKTOP NAVBAR === */}
      <header
        className={cn(
          "sticky top-0 z-50 hidden md:block transition-all duration-600",
          scrolled
            ? "bg-cream/90 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(201,169,110,0.15),0_8px_40px_rgba(10,26,62,0.06)]"
            : "bg-navy-950/70 backdrop-blur-lg"
        )}
      >
        <nav className="container-luxury flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3.5" aria-label={companyInfo.name}>
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white/10 p-1 transition-all duration-500 group-hover:bg-white/20" style={{ position: "relative" }}>
              <Image
                src={normalizeImageUrl(companyInfo.logo)}
                alt={companyInfo.name}
                fill
                className="object-contain"
                priority
                sizes="44px"
              />
            </div>
            <div className="flex items-center gap-2 leading-none">
              <span
                className={cn(
                  "font-serif text-[1.15rem] font-bold tracking-wide transition-colors duration-500",
                  scrolled ? "text-navy" : "text-cream"
                )}
              >
                Corona
              </span>
              <span className="h-4 w-px bg-gold-500/40" />
              <span
                className={cn(
                  "text-[9px] uppercase tracking-[0.25em] font-semibold transition-colors duration-500",
                  scrolled ? "text-gold-600" : "text-gold-champagne"
                )}
              >
                Properties Limited
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="mx-6 h-8 w-px bg-white/[0.08]" />
          <div className="hidden items-center gap-1.5 lg:flex">
            {headerLinks.map((item, idx) => {
              const labelLower = item.label.toLowerCase();
              const isDropdown = Boolean(
                item.isDropdown ||
                  (item.children && item.children.length > 0) ||
                  (labelLower === "about" && (!item.href || item.href === "#")) ||
                  ((labelLower === "properties" || labelLower === "projects") && (!item.href || item.href === "#"))
              );

              let dropdownItems: { label: string; href: string; description?: string }[] = [];
              if (item.children && item.children.length > 0) {
                dropdownItems = item.children;
              } else if (labelLower === "about") {
                dropdownItems = [
                  { label: "About Us", href: "/about" },
                  { label: "Group Profile", href: "/corona-group" },
                  { label: "Management Messages", href: "/team" },
                ];
              } else if (labelLower === "properties" || labelLower === "projects") {
                dropdownItems = propertyDropdownItems;
              }

              if (isDropdown && dropdownItems.length > 0) {
                return (
                  <NavDropdown
                    key={idx}
                    label={item.label}
                    items={dropdownItems}
                  />
                );
              }

              const isCurrent = item.href === "/" ? pathname === "/" : isActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href || "/"}
                  className={cn(
                    "relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                    scrolled
                      ? isCurrent
                        ? "text-gold-600"
                        : "text-navy-700 hover:text-gold-600"
                      : isCurrent
                      ? "text-gold-champagne"
                      : "text-cream/90 hover:text-gold-champagne"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
                      isCurrent ? "w-5" : "w-0"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Side: CTA */}
          <div className="flex items-center gap-3">
            <Link
              href={companyInfo.ctaLink || "/contact"}
              className={cn(
                "hidden lg:inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-400 hover:-translate-y-0.5",
                scrolled
                  ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy shadow-gold hover:shadow-gold-lg"
                  : "bg-white/15 backdrop-blur-sm text-cream border border-white/20 hover:bg-white/25 hover:border-gold/40"
              )}
            >
              <Diamond className="h-3.5 w-3.5" />
              {companyInfo.ctaText || "Book a Visit"}
            </Link>
          </div>
        </nav>
        <div
          className={cn(
            "h-px w-full transition-opacity duration-600",
            scrolled
              ? "bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-100"
              : "opacity-0"
          )}
        />
      </header>

      {/* === MOBILE MENU OVERLAY === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] xl:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-navy-950/90 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-[400px] flex-col bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 p-1.5">
                    <Image
                      src={companyInfo.logo}
                      alt={companyInfo.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-cream">Corona</p>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-gold">
                      Properties
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-cream/70 transition-all hover:bg-white/10 hover:text-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Contact */}
              <div className="flex items-center gap-4 border-b border-white/[0.06] px-8 py-3">
                <a
                  href={`tel:${companyInfo.phoneRaw}`}
                  className="flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5 text-gold-500" />
                  <span>{companyInfo.phone}</span>
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5 text-gold-500" />
                  <span>{companyInfo.email}</span>
                </a>
              </div>

              <nav className="flex-1 overflow-y-auto px-8 py-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-cream/30">
                  Main Navigation
                </p>
                <div className="space-y-1">
                  {headerLinks.map((item, idx) => {
                    const labelLower = item.label.toLowerCase();
                    const isDropdown = Boolean(
                      item.isDropdown ||
                        (item.children && item.children.length > 0) ||
                        (labelLower === "about" && (!item.href || item.href === "#")) ||
                        ((labelLower === "properties" || labelLower === "projects") && (!item.href || item.href === "#"))
                    );

                    let dropdownItems: { label: string; href: string; description?: string }[] = [];
                    if (item.children && item.children.length > 0) {
                      dropdownItems = item.children;
                    } else if (labelLower === "about") {
                      dropdownItems = [
                        { label: "About Us", href: "/about" },
                        { label: "Group Profile", href: "/corona-group" },
                        { label: "Management Messages", href: "/team" },
                      ];
                    } else if (labelLower === "properties" || labelLower === "projects") {
                      dropdownItems = propertyDropdownItems;
                    }

                    if (isDropdown && dropdownItems.length > 0) {
                      return (
                        <div key={idx} className="py-1">
                          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/80 flex items-center justify-between">
                            <span>{item.label}</span>
                            <ChevronDown className="h-3 w-3 text-gold/50" />
                          </p>
                          <div className="space-y-1 pl-2 border-l border-gold/20 ml-4 mb-2">
                            {dropdownItems.map((child, cIdx) => {
                              const isChildActive = child.href === "/" ? pathname === "/" : pathname.startsWith(child.href);
                              return (
                                <Link
                                  key={cIdx}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "group flex flex-col rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-300",
                                    isChildActive
                                      ? "bg-gold/15 text-gold font-semibold"
                                      : "text-cream/80 hover:bg-white/[0.04] hover:text-cream"
                                  )}
                                >
                                  <span>{child.label}</span>
                                  {child.description && (
                                    <span className="text-[10px] text-cream/40 leading-tight">
                                      {child.description}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    const isCurrent = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300",
                          isCurrent
                            ? "bg-gold/10 text-gold"
                            : "text-cream/80 hover:bg-white/[0.04] hover:text-cream"
                        )}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="border-t border-white/[0.06] px-8 py-4">
                <a
                  href={`tel:${companyInfo.phoneRaw}`}
                  className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  {companyInfo.phone}
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold mt-2"
                >
                  <Mail className="h-4 w-4 text-gold" />
                  {companyInfo.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
