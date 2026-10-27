"use client";

import Link from "next/link";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/utils";
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
  Globe,
} from "lucide-react";
import {
  SITE_CONFIG,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FOOTER_LINKS,
} from "@/lib/constants";
import PinterestIcon from "@/components/ui/PinterestIcon";
import { useState, useEffect } from "react";
import {
  getNavigationAction,
  getSettingsAction,
  getSocialLinksAction,
  submitLeadInquiryAction,
} from "@/lib/admin/actions";

const PLATFORM_ICONS: Record<string, any> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  Twitter,
  Pinterest: PinterestIcon,
  YouTube: Youtube,
};

interface FooterProps {
  initialCompany?: any;
  initialNavigation?: any;
  initialSocials?: any[];
}

export default function Footer({ initialCompany, initialNavigation, initialSocials }: FooterProps = {}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Navigation state with server defaults
  const [footerLinks, setFooterLinks] = useState<{
    company: { label: string; href: string }[];
    services: { label: string; href: string }[];
    support: { label: string; href: string }[];
    legal: { label: string; href: string }[];
  }>(() => {
    if (initialNavigation?.footer) {
      return {
        company: initialNavigation.footer.company?.length ? initialNavigation.footer.company : [...FOOTER_LINKS.company],
        services: initialNavigation.footer.services?.length ? initialNavigation.footer.services : [...FOOTER_LINKS.services],
        support: initialNavigation.footer.support?.length ? initialNavigation.footer.support : [...FOOTER_LINKS.support],
        legal: initialNavigation.footer.legal?.length ? initialNavigation.footer.legal : [...FOOTER_LINKS.legal],
      };
    }
    return {
      company: [...FOOTER_LINKS.company],
      services: [...FOOTER_LINKS.services],
      support: [...FOOTER_LINKS.support],
      legal: [...FOOTER_LINKS.legal],
    };
  });
  
  // Dynamic Contact & Company info initialized directly from server props
  const [contactInfo, setContactInfo] = useState({
    address: initialCompany?.address || CONTACT_INFO.address,
    phone: initialCompany?.phone || CONTACT_INFO.phone,
    phoneRaw: (initialCompany?.phone || CONTACT_INFO.phone).replace(/[^0-9+]/g, ""),
    email: initialCompany?.email || CONTACT_INFO.email,
    companyDescription: initialCompany?.about || initialCompany?.description || SITE_CONFIG.description,
    companyName: initialCompany?.name || SITE_CONFIG.name,
    logo: initialCompany?.logo || SITE_CONFIG.logo,
  });

  // Dynamic Social Links initialized with server props if available
  const [socials, setSocials] = useState<any[]>(
    initialSocials && initialSocials.length > 0
      ? initialSocials.filter((s) => s.isActive !== false)
      : [
          { platform: "Facebook", url: SOCIAL_LINKS.facebook },
          { platform: "Instagram", url: SOCIAL_LINKS.instagram },
          { platform: "LinkedIn", url: SOCIAL_LINKS.linkedin },
          { platform: "Twitter", url: SOCIAL_LINKS.twitter },
          { platform: "Pinterest", url: SOCIAL_LINKS.pinterest },
          { platform: "YouTube", url: SOCIAL_LINKS.youtube },
        ]
  );

  useEffect(() => {
    if (initialCompany) {
      setContactInfo({
        address: initialCompany.address || CONTACT_INFO.address,
        phone: initialCompany.phone || CONTACT_INFO.phone,
        phoneRaw: (initialCompany.phone || CONTACT_INFO.phone).replace(/[^0-9+]/g, ""),
        email: initialCompany.email || CONTACT_INFO.email,
        companyDescription: initialCompany.about || initialCompany.description || SITE_CONFIG.description,
        companyName: initialCompany.name || SITE_CONFIG.name,
        logo: initialCompany.logo || SITE_CONFIG.logo,
      });
    }
  }, [initialCompany]);

  useEffect(() => {
    if (initialNavigation?.footer) {
      setFooterLinks({
        company: initialNavigation.footer.company?.length ? initialNavigation.footer.company : [...FOOTER_LINKS.company],
        services: initialNavigation.footer.services?.length ? initialNavigation.footer.services : [...FOOTER_LINKS.services],
        support: initialNavigation.footer.support?.length ? initialNavigation.footer.support : [...FOOTER_LINKS.support],
        legal: initialNavigation.footer.legal?.length ? initialNavigation.footer.legal : [...FOOTER_LINKS.legal],
      });
    }
  }, [initialNavigation]);

  useEffect(() => {
    if (initialSocials && initialSocials.length > 0) {
      setSocials(initialSocials.filter((s) => s.isActive !== false));
    }
  }, [initialSocials]);

  useEffect(() => {
    // 1. Fetch Dynamic Navigation if not provided
    if (!initialNavigation) {
      getNavigationAction().then((nav) => {
        if (nav?.footer) {
          setFooterLinks({
            company: nav.footer.company || FOOTER_LINKS.company,
            services: nav.footer.services || FOOTER_LINKS.services,
            support: nav.footer.support || FOOTER_LINKS.support,
            legal: nav.footer.legal || FOOTER_LINKS.legal,
          });
        }
      });
    }

    // 2. Fetch Dynamic Settings if not provided
    if (!initialCompany) {
      getSettingsAction().then((s) => {
        if (s?.company) {
          setContactInfo((prev) => ({
            ...prev,
            address: s.company.address || prev.address,
            phone: s.company.phone || prev.phone,
            phoneRaw: (s.company.phone || prev.phone).replace(/[^0-9+]/g, ""),
            email: s.company.email || prev.email,
            companyDescription: s.company.about || prev.companyDescription,
            companyName: s.company.name || prev.companyName,
            logo: s.company.logo || prev.logo,
          }));
        }
      });
    }

    // 3. Fetch Dynamic Social Links if not provided
    if (!initialSocials || initialSocials.length === 0) {
      getSocialLinksAction().then((links) => {
        const active = links.filter((l) => l.isActive);
        if (active.length > 0) {
          setSocials(active);
        }
      });
    }
  }, [initialCompany, initialNavigation, initialSocials]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitLeadInquiryAction({
        name: "Newsletter Subscriber",
        phone: "N/A",
        email: email.trim(),
        source: "Website Footer Newsletter",
        message: "User subscribed to newsletter updates via website footer.",
      });
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch {
      // Fallback display
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } finally {
      setSubmitting(false);
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
                <div className="relative h-12 w-12 md:h-16 md:w-16" style={{ position: "relative" }}>
                  <Image
                    src={normalizeImageUrl(contactInfo.logo)}
                    alt={contactInfo.companyName}
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
                {contactInfo.companyDescription}
              </p>

              {/* Newsletter */}
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
                    disabled={submitting}
                    className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pr-12 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors md:px-5 md:py-3.5 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    disabled={submitting}
                    className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-navy transition-transform hover:scale-105 md:right-1.5 md:top-1.5 md:h-9 md:w-9 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </button>
                </form>
                {subscribed && (
                  <p className="mt-2 text-xs text-gold animate-fade-in">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>

            {/* Quick links + Services + Legal */}
            <div className="grid grid-cols-2 gap-8 md:contents md:gap-12">
              <div className="lg:col-span-2">
                <h4 className="font-serif text-base font-semibold text-cream mb-4 md:text-lg md:mb-5">
                  Company
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {footerLinks.company.map((link) => (
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
                  {footerLinks.services.map((link) => (
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
                  {footerLinks.legal.map((link) => (
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
                    {contactInfo.address}
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:${contactInfo.phoneRaw}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold md:h-5 md:w-5" />
                    {contactInfo.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-sm text-cream/70 transition-colors hover:text-gold"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gold md:h-5 md:w-5" />
                    {contactInfo.email}
                  </a>
                </li>
              </ul>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-2.5 md:mt-6 md:gap-3">
                {socials.map((item) => {
                  const Icon = PLATFORM_ICONS[item.platform] || Globe;
                  return (
                    <a
                      key={item.platform}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-cream/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy md:h-10 md:w-10"
                    >
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container-luxury flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-xs text-cream/50">
              © {new Date().getFullYear()} {contactInfo.companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-cream/50">
              {footerLinks.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
