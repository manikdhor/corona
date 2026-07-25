"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Handshake, Building2, Award, Headphones } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const REASONS = [
  { icon: ShieldCheck, title: "100% Legal Assurance", description: "Every plot comes with verified title, RAJUK approval, and complete legal documentation. Zero disputes, guaranteed." },
  { icon: TrendingUp, title: "High ROI Potential", description: "Strategically located plots in high-growth corridors, historically delivering 25–40% appreciation over 3 years." },
  { icon: Handshake, title: "Transparent Deals", description: "No hidden costs, no surprise clauses. What you see is exactly what you get — crystal-clear transactions." },
  { icon: Building2, title: "Premium Infrastructure", description: "Wide roads, underground utilities, proper drainage, and modern amenities on par with international standards." },
  { icon: Award, title: "Award-Winning Developer", description: "Recognized by REHAB and leading industry bodies for excellence in land development and customer satisfaction." },
  { icon: Headphones, title: "Lifetime Support", description: "Dedicated after-sales team supporting you through construction, resale, and lifelong property management." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gold/[0.03] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-navy/[0.02] blur-3xl" />

      <div className="container-luxury relative">
        <SectionHeading eyebrow="Why Corona Properties" title="The Corona Difference"
          subtitle="Six pillars that make us Bangladesh's most trusted name in premium residential land." />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-50 bg-white p-8 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1.5">
                {/* Number watermark */}
                <span className="absolute top-5 right-7 font-serif text-7xl font-bold text-navy/[0.035] transition-colors duration-500 group-hover:text-gold/10">
                  0{i + 1}
                </span>
                {/* Icon */}
                <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-8 w-8 text-navy" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy mb-3">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-navy-400">{reason.description}</p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
