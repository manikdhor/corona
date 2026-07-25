"use client";

import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url(/image-02.webp)" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-navy-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-transparent to-navy-950" />
      </div>

      {/* Top ornament */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
        <div className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
      </div>

      <div className="container-luxury relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="mx-auto max-w-3xl text-center">
          <span className="eyebrow !justify-center">
            <span className="text-gold-champagne">Ready to Begin?</span>
          </span>

          <h2 className="mt-6 font-serif text-display-md font-bold text-cream text-balance leading-[1.1]">
            Your Dream Plot is
            <br />
            <span className="text-gradient-gold italic">One Conversation Away</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-cream/75 max-w-2xl mx-auto">
            Schedule a complimentary consultation with our land experts. We'll guide you through every option, answer all your questions, and help you make a confident, informed decision.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/contact" variant="gold" showArrow>
              <Calendar className="h-4 w-4" />
              Book a Site Visit
            </Button>
            <a href={`tel:${CONTACT_INFO.phoneRaw}`}
              className="group inline-flex items-center gap-3 rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-cream backdrop-blur-sm transition-all duration-400 hover:border-gold hover:bg-gold hover:text-navy">
              <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
              {CONTACT_INFO.phone}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom ornament */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
        <div className="h-1 w-1 rotate-45 bg-gold/60" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
      </div>
    </section>
  );
}
