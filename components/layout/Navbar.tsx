"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Diamond, Mail } from "lucide-react";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import NavDropdown from "@/components/ui/NavDropdown";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* === NAVBAR === */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-600 md:hidden",
          scrolled
            ? "bg-cream/90 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(201,169,110,0.15),0_8px_40px_rgba(10,26,62,0.06)]"
            : "bg-navy-950/70 backdrop-blur-lg"
        )}
      >
        <nav className="flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label={SITE_CONFIG.name}>
            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white/10 p-1">
              <Image
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
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
        <div className={cn(
          "h-px w-full transition-opacity duration-600",
          scrolled ? "bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-100" : "opacity-0"
        )} />
      </header>

      {/* Desktop Navbar */}
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
          <Link href="/" className="group flex items-center gap-3.5" aria-label={SITE_CONFIG.name}>
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white/10 p-1 transition-all duration-500 group-hover:bg-white/20">
              <Image
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
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
            <Link
              href="/"
              className={cn(
                "relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                scrolled
                  ? pathname === "/"
                    ? "text-gold-600"
                    : "text-navy-700 hover:text-gold-600"
                  : pathname === "/"
                  ? "text-gold-champagne"
                  : "text-cream/90 hover:text-gold-champagne"
              )}
            >
              <span className="relative z-10">Home</span>
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
                  pathname === "/" ? "w-5" : "w-0"
                )}
              />
            </Link>
            <NavDropdown
              label="About"
              items={[
                { label: "About Us", href: "/about" },
                { label: "Group Profile", href: "/corona-group" },
                { label: "Management Messages", href: "/team" },
              ]}
            />
            <NavDropdown
              label="Properties"
              items={PROJECTS.map((p) => ({
                label: p.name,
                href: `/projects/${p.slug}`,
              }))}
            />
            <Link
              href="/gallery"
              className={cn(
                "relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                scrolled
                  ? isActive("/gallery")
                    ? "text-gold-600"
                    : "text-navy-700 hover:text-gold-600"
                  : isActive("/gallery")
                  ? "text-gold-champagne"
                  : "text-cream/90 hover:text-gold-champagne"
              )}
            >
              <span className="relative z-10">Gallery</span>
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
                  isActive("/gallery") ? "w-5" : "w-0"
                )}
              />
            </Link>
            <Link
              href="/blog"
              className={cn(
                "relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                scrolled
                  ? isActive("/blog")
                    ? "text-gold-600"
                    : "text-navy-700 hover:text-gold-600"
                  : isActive("/blog")
                  ? "text-gold-champagne"
                  : "text-cream/90 hover:text-gold-champagne"
              )}
            >
              <span className="relative z-10">Blog</span>
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
                  isActive("/blog") ? "w-5" : "w-0"
                )}
              />
            </Link>
            <Link
              href="/contact"
              className={cn(
                "relative px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                scrolled
                  ? isActive("/contact")
                    ? "text-gold-600"
                    : "text-navy-700 hover:text-gold-600"
                  : isActive("/contact")
                  ? "text-gold-champagne"
                  : "text-cream/90 hover:text-gold-champagne"
              )}
            >
              <span className="relative z-10">Contact</span>
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400",
                  isActive("/contact") ? "w-5" : "w-0"
                )}
              />
            </Link>
          </div>

{/* Right Side: CTA */}
          <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className={cn(
                  "hidden lg:inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-400 hover:-translate-y-0.5",
                  scrolled
                    ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy shadow-gold hover:shadow-gold-lg"
                    : "bg-white/15 backdrop-blur-sm text-cream border border-white/20 hover:bg-white/25 hover:border-gold/40"
                )}
              >
                <Diamond className="h-3.5 w-3.5" />
                Book a Visit
              </Link>
            </div>
        </nav>
        <div className={cn(
          "h-px w-full transition-opacity duration-600",
          scrolled ? "bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-100" : "opacity-0"
        )} />
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
                      <Image src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} fill className="object-contain" />
                    </div>
                    <div>
                      <p className="font-serif text-base font-bold text-cream">Corona</p>
                      <p className="text-[8px] uppercase tracking-[0.3em] text-gold">Properties</p>
                    </div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-cream/70 transition-all hover:bg-white/10 hover:text-cream">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Quick Contact */}
                <div className="flex items-center gap-4 border-b border-white/[0.06] px-8 py-3">
                  <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-gold">
                    <Phone className="h-3.5 w-3.5 text-gold-500" />
                    <span>{CONTACT_INFO.phone}</span>
                  </a>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-gold">
                    <Mail className="h-3.5 w-3.5 text-gold-500" />
                    <span>{CONTACT_INFO.email}</span>
                  </a>
                </div>
                <nav className="flex-1 overflow-y-auto px-8 py-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-cream/30">Main</p>
                  <div className="space-y-1">
                    <Link href="/" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300", pathname === "/" ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                      <span>Home</span>
                    </Link>
                    <div>
                      <p className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/30">About</p>
                      <Link href="/about" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300", pathname === "/about" ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                        <span>About Us</span>
                      </Link>
                      <Link href="/corona-group" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300", pathname.startsWith("/corona-group") ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                        <span>Group Profile</span>
                      </Link>
                      <Link href="/team" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300", pathname.startsWith("/team") ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                        <span>Management</span>
                      </Link>
                    </div>
                    <div>
                      <p className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/30">Properties</p>
                      {PROJECTS.map((project) => (
                        <Link key={project.id} href={`/projects/${project.slug}`} onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300", pathname.startsWith(`/projects/${project.slug}`) ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                          <span>{project.name}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/gallery" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300", pathname.startsWith("/gallery") ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                      <span>Gallery</span>
                    </Link>
                    <Link href="/blog" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-300", pathname.startsWith("/blog") ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                      <span>Blog</span>
                    </Link>
                    <Link href="/contact" onClick={() => setMobileOpen(false)} className={cn("group flex items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-medium transition-all duration-300", pathname.startsWith("/contact") ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-white/[0.04] hover:text-cream")}>
                      <span>Contact</span>
                    </Link>
                  </div>
                </nav>
                <div className="border-t border-white/[0.06] px-8 py-4">
                  <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold">
                    <Phone className="h-4 w-4 text-gold" />
                    {CONTACT_INFO.phone}
                  </a>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold mt-2">
                    <Mail className="h-4 w-4 text-gold" />
                    {CONTACT_INFO.email}
                  </a>
                </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </>
   );
 }
