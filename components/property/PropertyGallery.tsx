"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  // Normalize image list (at least one fallback image)
  const validImages = Array.isArray(images) && images.length > 0 ? images : ["/image-06.webp"];

  const next = useCallback(() => {
    setActive((p) => (p + 1) % validImages.length);
  }, [validImages.length]);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Autoplay slider (pauses on hover or if lightbox is open)
  useEffect(() => {
    if (validImages.length <= 1 || isHovered || lightbox) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [validImages.length, isHovered, lightbox, next]);

  // Keyboard navigation for slider and lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && lightbox) setLightbox(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, lightbox]);

  const activeIsVideo = isYoutubeUrl(validImages[active]);
  const activeYtId = getYoutubeVideoId(validImages[active]);
  const activeImageSrc = activeIsVideo
    ? getYoutubeThumbnail(validImages[active], "maxresdefault")
    : validImages[active];

  return (
    <div className="w-full">
      {/* --- STANDARD HERO SLIDER --- */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-navy-950 border border-navy-800/80 shadow-2xl group aspect-[16/10] sm:aspect-[16/9] lg:h-[560px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Active Slide Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeImageSrc}
              alt={`${title} - Slide ${active + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Elegant Gradient Scrim for Contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />

        {/* Video Play Button Overlay */}
        {activeIsVideo && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-navy-950/30 hover:bg-navy-950/40 transition group"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold text-navy shadow-2xl transform transition duration-300 group-hover:scale-110">
              <Play className="h-9 w-9 fill-navy ml-1" />
            </div>
            <span className="mt-3 rounded-full bg-navy/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold backdrop-blur-md border border-gold/30">
              Watch Video Tour
            </span>
          </button>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              type="button"
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/70 text-cream backdrop-blur-md border border-white/10 transition-all hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-xl sm:opacity-90 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              type="button"
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/70 text-cream backdrop-blur-md border border-white/10 transition-all hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-xl sm:opacity-90 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Fullscreen Expand Button */}
        <button
          onClick={() => setLightbox(true)}
          type="button"
          aria-label="View fullscreen"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-navy-950/70 text-cream backdrop-blur-md border border-white/10 transition-all hover:bg-gold hover:text-navy hover:scale-105 shadow-md"
        >
          <Expand className="h-4 w-4" />
        </button>

        {/* Bottom Bar: Slide Counter & Indicators */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Counter Badge */}
          <div className="rounded-full bg-navy-950/80 px-3.5 py-1 text-xs font-semibold text-cream/90 backdrop-blur-md border border-white/10 pointer-events-auto">
            {active + 1} / {validImages.length}
          </div>

          {/* Dots Indicator */}
          {validImages.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-full bg-navy-950/80 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    active === i
                      ? "w-6 bg-gradient-gold"
                      : "w-2 bg-cream/30 hover:bg-cream/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- THUMBNAIL CAROUSEL STRIP (Below Slider) --- */}
      {validImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy-800 scrollbar-track-transparent">
          {validImages.map((img, i) => {
            const isVid = isYoutubeUrl(img);
            const thumbSrc = isVid ? getYoutubeThumbnail(img) : img;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Select slide ${i + 1}`}
                className={cn(
                  "relative h-16 w-24 sm:h-20 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-200 bg-navy-950",
                  active === i
                    ? "border-gold ring-2 ring-gold/50 scale-[1.02] opacity-100 shadow-md"
                    : "border-navy-800/80 opacity-60 hover:opacity-100 hover:border-gold/40"
                )}
              >
                <Image
                  src={thumbSrc}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                />
                {isVid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30">
                    <Play className="h-5 w-5 text-gold fill-gold drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
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

            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous"
                  className="absolute left-4 sm:left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next"
                  className="absolute right-4 sm:right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
