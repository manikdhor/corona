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
        <div className="container-luxury py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16">
                  <Image
                    src={SITE_CONFIG.logo}
                    alt={SITE_CONFIG.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-cream">Corona</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                    Properties Limited
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-cream/70">
                {SITE_CONFIG.description}
              </p>

              {/* Newsletter */}
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
                  Subscribe to our newsletter
                </p>
                <form onSubmit={handleSubscribe} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3.5 pr-14 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-navy transition-transform hover:scale-105"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {subscribed && (
                  <p className="mt-2 text-xs text-gold">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="lg:col-span-2">
              <h4 className="font-serif text-lg font-semibold text-cream mb-5">
                Company
              </h4>
              <ul className="space-y-3">
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

            {/* Services links */}
            <div className="lg:col-span-2">
              <h4 className="font-serif text-lg font-semibold text-cream mb-5">
                Services
              </h4>
              <ul className="space-y-3">
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

            {/* Contact */}
            <div className="lg:col-span-4">
              <h4 className="font-serif text-lg font-semibold text-cream mb-5">
                Get in Touch
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed text-cream/70">
                    {CONTACT_INFO.address}
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT_INFO.phoneRaw}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Phone className="h-5 w-5 shrink-0 text-gold" />
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-gold" />
                    {CONTACT_INFO.email}
                  </a>
                </li>
              </ul>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                  { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                  { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
                  { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-cream/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy"
                  >
                    <Icon className="h-4 w-4" />
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
              <Link href="/contact" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-gold transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
