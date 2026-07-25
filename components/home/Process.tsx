"use client";

import { motion } from "framer-motion";
import { Search, FileCheck, Handshake, KeyRound } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  { icon: Search, step: "01", title: "Discovery", description: "We understand your goals, budget, and preferences, then curate the perfect plots from our portfolio." },
  { icon: FileCheck, step: "02", title: "Verification", description: "Our legal team conducts thorough title verification, due diligence, and documentation — at no extra cost." },
  { icon: Handshake, step: "03", title: "Transaction", description: "Transparent pricing, flexible payment plans, and seamless registration with full legal transfer." },
  { icon: KeyRound, step: "04", title: "Handover & Beyond", description: "Plot handover with mutation complete, plus lifetime after-sales support for construction and resale." },
];

export default function Process() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: "linear-gradient(rgba(201,169,110,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px" }} />
      {/* Orbs */}
      <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-gold/[0.06] blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container-luxury relative">
        <SectionHeading eyebrow="How We Work" title="A Seamless Journey to Ownership"
          subtitle="Four refined steps that take you from first inquiry to proud landowner — stress-free and fully supported." light />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }} className="group relative text-center">
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-12 left-[60%] hidden h-px w-full bg-gradient-to-r from-gold/40 to-transparent lg:block" />
                )}
                {/* Step circle */}
                <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:scale-110" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <Icon className="relative h-9 w-9 text-gold transition-colors duration-500 group-hover:text-navy" />
                </div>
                <span className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-gold">Step {step.step}</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/65">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
