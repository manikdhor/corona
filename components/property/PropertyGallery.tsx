"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X, Play } from "lucide-react";
import { cn, getYoutubeVideoId, getYoutubeThumbnail, isYoutubeUrl } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Normalize image list (at least one fallback image)
  const validImages = Array.isArray(images) && images.length > 0 ? images : ["/image-06.webp"];

  const next = () => setActive((p) => (p + 1) % validImages.length);
  const prev = () => setActive((p) => (p - 1 + validImages.length) % validImages.length);

  const activeIsVideo = isYoutubeUrl(validImages[active]);
  const activeYtId = getYoutubeVideoId(validImages[active]);
  const activeImageSrc = activeIsVideo ? getYoutubeThumbnail(validImages[active], "maxresdefault") : validImages[active];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:h-[560px]">
        {/* Main image / video preview */}
        <div className="relative lg:col-span-3 lg:row-span-2 overflow-hidden rounded-2xl group aspect-[16/10] lg:aspect-auto bg-navy-950">
          <Image
            src={activeImageSrc}
            alt={`${title} - Item ${active + 1}`}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 75vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />

          {/* Video Play Button Overlay */}
          {activeIsVideo && (
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-navy-950/30 hover:bg-navy-950/40 transition group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold text-navy shadow-2xl transform transition duration-300 group-hover:scale-110">
                <Play className="h-8 w-8 fill-navy ml-1" />
              </div>
              <span className="mt-3 rounded-full bg-navy/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gold backdrop-blur-md border border-gold/30">
                Watch Video Tour
              </span>
            </button>
          )}

          {/* Controls */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous item"
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-navy backdrop-blur-sm transition-all hover:bg-cream opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next item"
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-navy backdrop-blur-sm transition-all hover:bg-cream opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Expand */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="View fullscreen"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-navy/50 text-cream backdrop-blur-sm transition-all hover:bg-navy/70"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 z-20 rounded-full bg-navy/60 px-4 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
            {active + 1} / {validImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {validImages.slice(0, 4).map((img, i) => {
          const isVid = isYoutubeUrl(img);
          const thumbSrc = isVid ? getYoutubeThumbnail(img) : img;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative hidden lg:block overflow-hidden rounded-xl transition-all duration-300 bg-navy-950",
                active === i ? "ring-2 ring-gold ring-offset-2 ring-offset-navy-950" : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={thumbSrc}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
              {isVid && (
                <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30">
                  <Play className="h-6 w-6 text-gold fill-gold drop-shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              className="absolute left-4 sm:left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeIsVideo && activeYtId ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-navy-700">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${title} - Video Tour`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative h-[80vh] w-[90vw] max-w-5xl">
                  <Image
                    src={validImages[active]}
                    alt={`${title} - fullscreen`}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              className="absolute right-4 sm:right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
