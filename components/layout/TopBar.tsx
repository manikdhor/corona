"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, Sparkles, MapPin } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import PinterestIcon from "@/components/ui/PinterestIcon";
import { getSettingsAction, getSocialLinksAction } from "@/lib/admin/actions";

const PLATFORM_ICONS: Record<string, any> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  Twitter,
  Pinterest: PinterestIcon,
  YouTube: Youtube,
};

interface TopBarProps {
  initialCompany?: any;
  initialSocials?: any[];
}

export default function TopBar({ initialCompany, initialSocials }: TopBarProps = {}) {
  const [phone, setPhone] = useState(initialCompany?.phone || CONTACT_INFO.phone);
  const [email, setEmail] = useState(initialCompany?.email || CONTACT_INFO.email);
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
    if (initialCompany?.phone) setPhone(initialCompany.phone);
    if (initialCompany?.email) setEmail(initialCompany.email);
  }, [initialCompany]);

  useEffect(() => {
    if (initialSocials && initialSocials.length > 0) {
      setSocials(initialSocials.filter((s) => s.isActive !== false));
    }
  }, [initialSocials]);

  useEffect(() => {
    if (!initialCompany) {
      getSettingsAction().then((s) => {
        if (s?.company?.phone) setPhone(s.company.phone);
        if (s?.company?.email) setEmail(s.company.email);
      });
    }
    if (!initialSocials || initialSocials.length === 0) {
      getSocialLinksAction().then((links) => {
        const active = links.filter((l) => l.isActive);
        if (active.length > 0) setSocials(active);
      });
    }
  }, [initialCompany, initialSocials]);

  const phoneRaw = phone.replace(/[^0-9+]/g, "");

  return (
    <div className="hidden lg:block bg-[#050b18] border-b border-gold-500/15 relative z-40 transition-colors duration-300">
      <div className="container-luxury flex h-9 items-center justify-between text-[11px] font-sans">
        {/* Left: Prestige Tagline & Direct Contacts */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-2 text-gold-400/90 font-medium tracking-[0.16em] uppercase text-[10px]">
            <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />
            <span>Prestige Land & Luxury Estates</span>
            <span className="h-3 w-px bg-gold-500/25 ml-2" />
          </div>

          <a
            href={`tel:${phoneRaw}`}
            className="group flex items-center gap-2 text-cream/70 transition-colors duration-300 hover:text-gold-champagne"
            title="Direct VIP Hotline"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20 group-hover:scale-110 transition-all duration-300">
              <Phone className="h-2.5 w-2.5" />
            </span>
            <span className="font-medium tracking-wide">{phone}</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-2 text-cream/70 transition-colors duration-300 hover:text-gold-champagne"
            title="Official Correspondence"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20 group-hover:scale-110 transition-all duration-300">
              <Mail className="h-2.5 w-2.5" />
            </span>
            <span className="font-medium tracking-wide">{email}</span>
          </a>
        </div>

        {/* Right: Location/Hours + Polished Social Tokens */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-cream/50 text-[10.5px] tracking-wider">
            <MapPin className="h-3 w-3 text-gold-500/70" />
            <span>Niketan, Gulshan-1, Dhaka</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08] hidden md:block" />

          <div className="flex items-center gap-2">
            {socials.map((item) => {
              const Icon = PLATFORM_ICONS[item.platform] || Globe;
              return (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.platform}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-cream/50 transition-all duration-300 hover:border-gold-500/40 hover:bg-gold-500/15 hover:text-gold-300 hover:scale-110 shadow-sm"
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Globe(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
