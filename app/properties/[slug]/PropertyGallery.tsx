"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = () => setActive((p) => (p + 1) % images.length);
  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:h-[560px]">
        {/* Main image */}
        <div className="relative lg:col-span-3 lg:row-span-2 overflow-hidden rounded-2xl group aspect-[16/10] lg:aspect-auto">
          <Image
            src={images[active]}
            alt={`${title} - Image ${active + 1}`}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 75vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-navy backdrop-blur-sm transition-all hover:bg-cream opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-navy backdrop-blur-sm transition-all hover:bg-cream opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Expand */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="View fullscreen"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-navy/50 text-cream backdrop-blur-sm transition-all hover:bg-navy/70"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 rounded-full bg-navy/60 px-4 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative hidden lg:block overflow-hidden rounded-xl transition-all duration-300",
              active === i ? "ring-2 ring-gold ring-offset-2 ring-offset-navy-950" : "opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={img}
              alt={`${title} thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/95 backdrop-blur-xl p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${title} - fullscreen`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
