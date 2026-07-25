"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Residential", "Aerial Views", "Layouts"];

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((p) => (p === null ? null : (p + 1) % filtered.length));
  const prevImage = () =>
    setLightboxIndex((p) =>
      p === null ? null : (p - 1 + filtered.length) % filtered.length
    );

  return (
    <>
      {/* Category filter */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300",
              filter === cat
                ? "bg-gradient-gold text-navy shadow-gold"
                : "bg-white text-navy hover:bg-navy-50 shadow-card"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {filtered.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            onClick={() => openLightbox(i)}
            className="group relative block w-full overflow-hidden rounded-2xl shadow-card"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-navy opacity-0 transition-opacity duration-500 group-hover:opacity-90">
              <ZoomIn className="h-10 w-10 text-gold" />
              <p className="mt-3 font-serif text-lg font-bold text-cream">{img.title}</p>
              <p className="text-xs uppercase tracking-wider text-gold">{img.category}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/95 backdrop-blur-xl p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous"
              className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].title}
                fill
                className="object-contain"
                sizes="90vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950 to-transparent p-6 text-center">
                <p className="font-serif text-xl font-bold text-cream">{filtered[lightboxIndex].title}</p>
                <p className="text-xs uppercase tracking-wider text-gold">{filtered[lightboxIndex].category}</p>
              </div>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
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
