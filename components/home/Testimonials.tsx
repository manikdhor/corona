"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % TESTIMONIALS.length);
  const prev = () => setActive((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const testimonial = TESTIMONIALS[active];

  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      {/* Decorative quote */}
      <div className="absolute top-16 left-8 text-[18rem] font-serif text-navy/[0.025] leading-none select-none hidden md:block">&ldquo;</div>
      <div className="absolute bottom-16 right-8 text-[18rem] font-serif text-navy/[0.025] leading-none select-none hidden md:block rotate-180">&ldquo;</div>

      <div className="container-luxury relative">
        <SectionHeading eyebrow="Client Stories" title="Trusted by 1,200+ Families"
          subtitle="Don't just take our word for it. Hear from the families and investors who chose Corona Properties." />

        <div className="mt-16 mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }} className="relative rounded-3xl bg-white p-8 md:p-12 shadow-card border border-navy-50">
              {/* Quote icon */}
              <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-gold">
                <Quote className="h-6 w-6 text-navy" />
              </div>
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-display text-xl md:text-2xl leading-relaxed text-navy italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold/30">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-navy">{testimonial.name}</p>
                  <p className="text-sm text-navy-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={prev} aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-100 text-navy transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-gold" : "w-2 bg-navy-100 hover:bg-gold/50"}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-100 text-navy transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
