"use client";

import { Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-navy-950 border-b border-white/[0.06]">
      <div className="container-luxury flex h-10 items-center justify-between text-[11px] tracking-wider">
        <div className="flex items-center gap-6">
          <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="flex items-center gap-2 text-cream/60 transition-colors duration-300 hover:text-gold-champagne">
            <Phone className="h-3 w-3 text-gold-500" />
            <span>{CONTACT_INFO.phone}</span>
          </a>
          <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 text-cream/60 transition-colors duration-300 hover:text-gold-champagne">
            <Mail className="h-3 w-3 text-gold-500" />
            <span>{CONTACT_INFO.email}</span>
          </a>
        </div>
        <div className="flex items-center gap-5">
          {[{ Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
            { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
            { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
            { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
          ].map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="text-cream/40 transition-all duration-300 hover:text-gold hover:scale-110">
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
