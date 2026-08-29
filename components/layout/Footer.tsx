"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  Send,
} from "lucide-react";
import {
  SITE_CONFIG,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FOOTER_LINKS,
  NAV_LINKS,
} from "@/lib/constants";
import PinterestIcon from "@/components/ui/PinterestIcon";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-navy text-cream">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-gold" />

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #c9a96e 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main footer */}
        <div className="container-luxury py-12 md:py-20">
          <div className="grid gap-10 md:gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 md:h-16 md:w-16">
                  <Image
                    src={SITE_CONFIG.logo}
                    alt={SITE_CONFIG.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-cream md:text-xl">Corona</p>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gold md:text-[10px]">
                    Properties Limited
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream/70 md:mt-6">
                {SITE_CONFIG.description}
              </p>

              {/* Newsletter - moved up on mobile */}
              <div className="mt-6 md:mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-2 md:mb-3">
                  Subscribe to our newsletter
                </p>
                <form onSubmit={handleSubscribe} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pr-12 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors md:px-5 md:py-3.5"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-navy transition-transform hover:scale-105 md:right-1.5 md:top-1.5 md:h-9 md:w-9"
                  >
                    <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </button>
                </form>
                {subscribed && (
                  <p className="mt-2 text-xs text-gold">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>

            {/* Quick links + Services + Legal - stacked on mobile */}
            <div className="grid grid-cols-2 gap-8 md:contents md:gap-12">
              <div className="lg:col-span-2">
                <h4 className="font-serif text-base font-semibold text-cream mb-4 md:text-lg md:mb-5">
                  Company
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {FOOTER_LINKS.company.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
                      >
                        <ArrowRight className="h-3 w-3 -translate-x-2 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2">
                <h4 className="font-serif text-base font-semibold text-cream mb-4 md:text-lg md:mb-5">
                  Services
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {FOOTER_LINKS.services.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
                      >
                        <ArrowRight className="h-3 w-3 -translate-x-2 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2">
                <h4 className="font-serif text-base font-semibold text-cream mb-4 md:text-lg md:mb-5">
                  Legal
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {FOOTER_LINKS.legal.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
                      >
                        <ArrowRight className="h-3 w-3 -translate-x-2 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="font-serif text-base font-semibold text-cream mb-4 md:text-lg md:mb-5">
                Get in Touch
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold md:h-5 md:w-5" />
                  <span className="text-sm leading-relaxed text-cream/70">
                    {CONTACT_INFO.address}
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT_INFO.phoneRaw}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold md:h-5 md:w-5" />
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gold md:h-5 md:w-5" />
                    {CONTACT_INFO.email}
                  </a>
                </li>
              </ul>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-2.5 md:mt-6 md:gap-3">
                {[
                  { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                  { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                  { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
                  { Icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
                  { Icon: PinterestIcon, href: SOCIAL_LINKS.pinterest, label: "Pinterest" },
                  { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-cream/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy md:h-10 md:w-10"
                  >
                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container-luxury flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-xs text-cream/50">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-cream/50">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-gold transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/disclaimer" className="hover:text-gold transition-colors">
                Disclaimer
              </Link>
              <Link href="/refund-policy" className="hover:text-gold transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
