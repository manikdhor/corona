"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
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
    <div className="hidden lg:block bg-navy-950 border-b border-white/[0.06]">
      <div className="container-luxury flex h-10 items-center justify-between text-[11px] tracking-wider">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phoneRaw}`}
            className="flex items-center gap-2 text-cream/60 transition-colors duration-300 hover:text-gold-champagne"
          >
            <Phone className="h-3 w-3 text-gold-500" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-cream/60 transition-colors duration-300 hover:text-gold-champagne"
          >
            <Mail className="h-3 w-3 text-gold-500" />
            <span>{email}</span>
          </a>
        </div>
        <div className="flex items-center gap-5">
          {socials.map((item) => {
            const Icon = PLATFORM_ICONS[item.platform] || Globe;
            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.platform}
                className="text-cream/40 transition-all duration-300 hover:text-gold hover:scale-110"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
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
