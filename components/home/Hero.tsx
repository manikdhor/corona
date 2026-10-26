"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const HERO_SLIDES = [
  "/image-01.webp",
  "/image-02.webp",
  "/image-03.webp",
];

export interface HeroProps {
  data?: {
    eyebrow?: string;
    headline?: string;
    subtitle?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    slides?: string[];
    stats?: { value: string; label: string }[];
    showOverlay?: boolean;
  };
}

export default function Hero({ data }: HeroProps = {}) {
  const slides = data?.slides && data.slides.length > 0 ? data.slides : HERO_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative min-h-screen overflow-hidden bg-navy-900 md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${SITE_CONFIG.name} Slide ${i + 1}`}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>

      <div
        className={`absolute inset-0 ${
          data?.showOverlay ? "bg-gradient-to-b from-navy-950/75 via-navy-950/60 to-navy-950/85" : "bg-navy-950/30"
        }`}
      />

      {data?.showOverlay && (
        <div className="container-luxury relative z-10 py-28 text-center text-cream">
          {data.eyebrow && (
            <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-sm">
              {data.eyebrow}
            </span>
          )}
          {data.headline && (
            <h1 className="mx-auto mt-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl">
              {data.headline}
            </h1>
          )}
          {data.subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">
              {data.subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {data.primaryCtaText && (
              <Link
                href={data.primaryCtaLink || "/projects/maple-leaf-garden-city"}
                className="btn-gold inline-flex items-center gap-2"
              >
                {data.primaryCtaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {data.secondaryCtaText && (
              <Link
                href={data.secondaryCtaLink || "/contact"}
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-white/10 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-navy"
              >
                {data.secondaryCtaText}
              </Link>
            )}
          </div>

          {data.stats && data.stats.length > 0 && (
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl border border-white/15 bg-navy-950/60 p-6 backdrop-blur-md sm:grid-cols-4">
              {data.stats.map((st, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-serif text-2xl font-bold text-gold sm:text-3xl">{st.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cream/70">{st.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 md:left-8"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 md:right-8"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-gold" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
