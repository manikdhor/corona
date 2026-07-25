"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Genesis() {
  return (
    <section className="section-padding relative overflow-hidden bg-navy-50/40">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gold/[0.04] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-navy/[0.03] blur-3xl" />

      <div className="container-luxury relative">
        <div className="grid items-center gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="eyebrow">Our Origin Story</span>
            <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance leading-[1.1]">
              From Toronto to Purbachal — A Story of Vision
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-navy-400">
              <p>
                Behind every great community lies a conviction that world-class living should know no borders.{" "}
                <span className="font-medium text-navy">Maple Leaf Garden City</span> was born from a thought that germinated in Toronto — a question asked by Bangladeshi expatriates who discovered something they wanted to bring home:
              </p>
              <p className="font-display text-2xl italic text-navy/80">
                "Can the quality of life we experience abroad become available here?"
              </p>
              <p>
                We didn't simply replicate a concept. We envisioned a place where the serenity of a maple-lined boulevard and the architectural discipline of a planned city merge with the warmth of Bangladeshi community life.
              </p>
              <p className="font-medium text-navy">
                This is the birth of an address that will outlive generations. A statement that the future of Bangladesh can be shaped by Bangladeshi visionaries, with international-grade standards and local heart.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="#project" variant="gold" showArrow>
                Explore the Project
              </Button>
              <a
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:text-gold-600"
              >
                Discover Our Story
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-navy">
              <Image
                src="/Toronto_to_Purbachal.webp"
                alt="From Toronto to Purbachal — A Story of Vision"
                fill
                className="object-cover transition-transform duration-[1200ms] hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
            </div>

              <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-6 -left-4 md:-left-8 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-7 shadow-gold-lg text-cream max-w-[240px] border border-white/[0.06]"
            >
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <p className="font-serif text-5xl font-bold text-gradient-gold">100%</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] leading-relaxed text-cream/70">
                Legal & Transparent Transactions
              </p>
            </motion.div>

            <div className="absolute -top-6 -right-6 -z-10 h-full w-full rounded-[2rem] border border-gold/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
