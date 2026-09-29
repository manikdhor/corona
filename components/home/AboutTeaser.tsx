"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { normalizeImageUrl } from "@/lib/utils";

export interface AboutTeaserProps {
  data?: {
    eyebrow?: string;
    heading?: string;
    p1?: string;
    p2?: string;
    badgeValue?: string;
    badgeLabel?: string;
    image?: string;
    bullets?: string[];
  };
}

const DEFAULT_HIGHLIGHTS = [
  "Approved residential plots",
  "100% clear & verified titles",
  "Underground utilities & wide roads",
  "Transparent, end-to-end support",
];

export default function AboutTeaser({ data }: AboutTeaserProps) {
  const eyebrow = data?.eyebrow || "About Corona Properties";
  const heading = data?.heading || "Crafting Premium Communities Across Bangladesh";
  const p1 =
    data?.p1 ||
    "Corona Properties Limited is redefining residential land development in Bangladesh. We don't just sell plots — we craft communities where families build their dreams and investors grow their wealth with confidence.";
  const p2 =
    data?.p2 ||
    "Every project reflects our unwavering commitment to legal transparency, world-class infrastructure, and long-term value creation.";
  const badgeValue = data?.badgeValue || "100%";
  const badgeLabel = data?.badgeLabel || "Legal & Transparent Transactions";
  const imageSrc = normalizeImageUrl(data?.image || "/About-corone.webp");
  const highlights =
    data?.bullets && data.bullets.length > 0 ? data.bullets : DEFAULT_HIGHLIGHTS;

  return (
    <section className="section-padding relative overflow-hidden bg-cream">
      {/* Soft gold glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gold/[0.04] blur-3xl" />

      <div className="container-luxury relative">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-navy" style={{ position: "relative" }}>
              <Image
                src={imageSrc}
                alt={heading}
                fill
                className="object-cover transition-transform duration-[1200ms] hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Image gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
            </div>

            {/* Floating experience card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-4 md:-right-8 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-7 shadow-gold-lg text-cream max-w-[230px] border border-white/[0.06]"
            >
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <p className="font-serif text-5xl font-bold text-gradient-gold">{badgeValue}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] leading-relaxed text-cream/70">
                {badgeLabel}
              </p>
            </motion.div>

            {/* Decorative border frame */}
            <div className="absolute -top-6 -left-6 -z-10 h-full w-full rounded-[2rem] border border-gold/30" />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance leading-[1.1]">
              {heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy-400">
              {p1}
            </p>
            {p2 && (
              <p className="mt-4 leading-relaxed text-navy-400">
                {p2}
              </p>
            )}

            <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
              {highlights.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15">
                    <Check className="h-3.5 w-3.5 text-gold-600" />
                  </span>
                  <span className="text-sm font-medium text-navy">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="/about" variant="gold" showArrow>
                Discover Our Story
              </Button>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:text-gold-600"
              >
                Our Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
