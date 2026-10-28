"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Diamond, Mail, ChevronDown, Sparkles } from "lucide-react";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import NavDropdown from "@/components/ui/NavDropdown";
import { cn, normalizeImageUrl } from "@/lib/utils";
import { getNavigationAction, getSettingsAction } from "@/lib/admin/actions";
import { AdminNavigation } from "@/lib/admin/seed";

interface NavbarProps {
  initialCompany?: any;
  initialNavigation?: AdminNavigation | null;
}

export default function Navbar({ initialCompany, initialNavigation }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Dynamic Navigation & Company settings initialized directly from server props
  const [navData, setNavData] = useState<AdminNavigation | null>(initialNavigation || null);
  const [companyInfo, setCompanyInfo] = useState({
    name: initialCompany?.name || SITE_CONFIG.name,
    shortName: initialCompany?.shortName || SITE_CONFIG.shortName,
    logo: initialCompany?.logo || SITE_CONFIG.logo,
    phone: initialCompany?.phone || CONTACT_INFO.phone,
    phoneRaw: (initialCompany?.phone || CONTACT_INFO.phone).replace(/[^0-9+]/g, ""),
    email: initialCompany?.email || CONTACT_INFO.email,
    ctaText: initialCompany?.ctaText || "Book a Visit",
    ctaLink: initialCompany?.ctaLink || "/contact",
  });

  useEffect(() => {
    if (initialCompany) {
      setCompanyInfo({
        name: initialCompany.name || SITE_CONFIG.name,
        shortName: initialCompany.shortName || SITE_CONFIG.shortName,
        logo: initialCompany.logo || SITE_CONFIG.logo,
        phone: initialCompany.phone || CONTACT_INFO.phone,
        phoneRaw: (initialCompany.phone || CONTACT_INFO.phone).replace(/[^0-9+]/g, ""),
        email: initialCompany.email || CONTACT_INFO.email,
        ctaText: initialCompany.ctaText || "Book a Visit",
        ctaLink: initialCompany.ctaLink || "/contact",
      });
    }
  }, [initialCompany]);

  useEffect(() => {
    if (initialNavigation) {
      setNavData(initialNavigation);
    }
  }, [initialNavigation]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 35);
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
    if (!initialNavigation) {
      getNavigationAction().then((nav) => {
        if (nav) setNavData(nav);
      });
    }

    if (!initialCompany) {
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
    }
  }, [initialCompany, initialNavigation]);

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
          "sticky top-0 z-50 transition-all duration-500 lg:hidden",
          scrolled
            ? "bg-[#050c1e]/95 backdrop-blur-xl border-b border-gold-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            : "bg-[#060c1c]/90 backdrop-blur-lg border-b border-white/[0.08]"
        )}
      >
        <nav className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3" aria-label={companyInfo.name}>
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] p-1.5 border border-gold-500/30 shadow-sm" style={{ position: "relative" }}>
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
              <span className="font-serif text-base font-bold tracking-wide text-cream">
                Corona
              </span>
              <span className="h-3 w-px bg-gold-500/40" />
              <span className="text-[8px] uppercase tracking-[0.25em] font-semibold text-gold-400">
                Properties
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${companyInfo.phoneRaw}`}
              aria-label="Call Hotline"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-gold-400 hover:border-gold-400 hover:bg-gold-500/20 transition-all"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 transition-all hover:bg-gold-500/20"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </header>

      {/* === DESKTOP NAVBAR === */}
      <header
        className={cn(
          "sticky top-0 z-50 hidden lg:block transition-all duration-500",
          scrolled
            ? "bg-[#050c1e]/95 backdrop-blur-xl border-b border-gold-500/20 shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
            : "bg-[#060c1c]/80 backdrop-blur-md border-b border-white/[0.08]"
        )}
      >
        <nav
          className={cn(
            "container-luxury flex items-center justify-between transition-all duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          {/* Zone 1: Logo & Brand Signature */}
          <Link href="/" className="group flex items-center gap-3.5" aria-label={companyInfo.name}>
            <div
              className={cn(
                "relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-gold-500/30 shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]",
                scrolled ? "h-10 w-10 p-1" : "h-11 w-11 p-1.5"
              )}
              style={{ position: "relative" }}
            >
              <Image
                src={normalizeImageUrl(companyInfo.logo)}
                alt={companyInfo.name}
                fill
                className="object-contain"
                priority
                sizes="44px"
              />
            </div>
            <div className="flex items-center gap-2.5 leading-none">
              <span className="font-serif text-[1.28rem] font-bold tracking-wide text-cream group-hover:text-gold-200 transition-colors">
                Corona
              </span>
              <span className="h-4 w-[1.5px] bg-gradient-to-b from-transparent via-gold-400 to-transparent" />
              <span className="text-[9px] uppercase tracking-[0.28em] font-semibold text-gold-400/90 group-hover:text-gold-300 transition-colors">
                Properties Limited
              </span>
            </div>
          </Link>

          {/* Zone 2: Centered Desktop Navigation */}
          <div className="flex items-center gap-1 xl:gap-1.5">
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
                  { label: "About Us", href: "/about", description: "Our legacy, vision & leadership" },
                  { label: "Group Profile", href: "/corona-group", description: "The overarching enterprise" },
                  { label: "Management Messages", href: "/team", description: "Words from our leadership" },
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
                    "relative px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                    isCurrent
                      ? "text-gold-300 bg-white/[0.05]"
                      : "text-cream/80 hover:text-cream hover:bg-white/[0.04]"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isCurrent && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 shadow-[0_0_8px_rgba(201,169,110,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Zone 3: Actions & High-Conversion CTA */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${companyInfo.phoneRaw}`}
              className="hidden 2xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] text-cream/70 hover:border-gold-500/40 hover:text-gold-200 transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
              <span className="font-medium tracking-wide">VIP Concierge</span>
            </a>

            <Link
              href={companyInfo.ctaLink || "/contact"}
              className="relative group overflow-hidden inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.16em] bg-gradient-to-r from-[#d4ab53] via-[#c9a96e] to-[#b8924a] text-navy-950 shadow-[0_4px_20px_rgba(201,169,110,0.35)] hover:shadow-[0_8px_30px_rgba(201,169,110,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <Diamond className="h-3.5 w-3.5 fill-navy-950/20 text-navy-950" />
              <span className="relative z-10">{companyInfo.ctaText || "Book a Visit"}</span>
            </Link>
          </div>
        </nav>

        {/* Ambient bottom gold hairline */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-400/25 to-transparent" />
      </header>

      {/* === MOBILE MENU OVERLAY === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-navy-950/85 backdrop-blur-md"
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
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-[400px] flex-col bg-gradient-to-b from-[#081329] via-[#050c1a] to-[#030712] border-l border-gold-500/20 shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-7 py-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] p-1.5 border border-gold-500/30">
                    <Image
                      src={normalizeImageUrl(companyInfo.logo)}
                      alt={companyInfo.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-cream">Corona</p>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
                      Properties Limited
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-cream/70 transition-all hover:bg-gold-500/20 hover:text-gold hover:border-gold-500/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Contact Bar */}
              <div className="flex items-center justify-around border-b border-white/[0.06] bg-white/[0.02] px-6 py-3 text-xs">
                <a
                  href={`tel:${companyInfo.phoneRaw}`}
                  className="flex items-center gap-2 text-cream/75 transition-colors hover:text-gold"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/15 text-gold">
                    <Phone className="h-3 w-3" />
                  </span>
                  <span>Call Us</span>
                </a>
                <span className="h-4 w-px bg-white/[0.1]" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-2 text-cream/75 transition-colors hover:text-gold"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/15 text-gold">
                    <Mail className="h-3 w-3" />
                  </span>
                  <span>Email</span>
                </a>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-gold-400/80 font-semibold">
                  Navigation
                </p>
                <div className="space-y-1.5">
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
                        <div key={idx} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2">
                          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-400 flex items-center justify-between">
                            <span>{item.label}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-gold-400/60" />
                          </p>
                          <div className="space-y-1 pl-2 border-l border-gold-500/30 ml-3 my-1">
                            {dropdownItems.map((child, cIdx) => {
                              const isChildActive = child.href === "/" ? pathname === "/" : pathname.startsWith(child.href);
                              return (
                                <Link
                                  key={cIdx}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex flex-col rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                                    isChildActive
                                      ? "bg-gold/15 text-gold-300 font-semibold"
                                      : "text-cream/70 hover:bg-white/[0.04] hover:text-cream"
                                  )}
                                >
                                  <span>{child.label}</span>
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
                          "flex items-center justify-between rounded-xl px-4 py-3 text-[13.5px] font-medium transition-all duration-200",
                          isCurrent
                            ? "bg-gold-500/15 text-gold-300 font-semibold border-l-2 border-gold-400"
                            : "text-cream/80 hover:bg-white/[0.04] hover:text-cream"
                        )}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Drawer Footer CTA */}
              <div className="border-t border-white/[0.08] p-6 space-y-3 bg-[#040813]">
                <Link
                  href={companyInfo.ctaLink || "/contact"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-[0.16em] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy-950 shadow-[0_4px_20px_rgba(201,169,110,0.35)]"
                >
                  <Diamond className="h-4 w-4 fill-navy-950/20 text-navy-950" />
                  <span>{companyInfo.ctaText || "Book a Visit"}</span>
                </Link>

                <p className="text-center text-[10px] tracking-wider text-cream/40">
                  Niketan, Gulshan-1, Dhaka • Bangladesh
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
