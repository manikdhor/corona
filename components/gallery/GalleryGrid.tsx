"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Video } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";
import { cn, getYoutubeVideoId, getYoutubeThumbnail, isYoutubeUrl } from "@/lib/utils";
import type { AdminCategory } from "@/lib/admin/seed";

const DEFAULT_CATEGORIES = ["Residential", "Aerial Views", "Layouts", "Video Tours"];

interface GalleryGridProps {
  items?: any[];
  categories?: AdminCategory[];
}

export default function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sourceImages = useMemo(() => {
    if (items && items.length > 0) {
      return items.map((m, idx) => {
        const rawUrl = m.url || m.src || "/image-01.webp";
        const ytId = getYoutubeVideoId(rawUrl) || (m.mimeType === "video/youtube" ? getYoutubeVideoId(m.url) : null);
        const isVideo = !!ytId || m.mimeType === "video/youtube" || m.mimeType?.startsWith("video/");
        const thumb = ytId
          ? getYoutubeThumbnail(ytId, "hqdefault")
          : m.thumbnailUrl || rawUrl;

        return {
          id: m.id || `img-${idx}`,
          src: rawUrl,
          thumbnail: thumb,
          isVideo,
          youtubeId: ytId,
          alt: m.altText || m.alt || m.title || "Corona Properties Gallery",
          category: m.category || "Residential",
          aspect: m.aspect || "aspect-[4/3]",
          title: m.title || m.filename || "Property View",
        };
      });
    }

    return GALLERY_IMAGES.map((img) => ({
      ...img,
      src: (img as any).url || (img as any).src,
      thumbnail: (img as any).url || (img as any).src,
      isVideo: false,
      youtubeId: null,
    }));
  }, [items]);

  const CATEGORIES = useMemo(() => {
    const activeCats = (categories || []).filter((c) => c.isActive).map((c) => c.name);
    const base = activeCats.length > 0 ? activeCats : DEFAULT_CATEGORIES;
    return ["All", ...base];
  }, [categories]);

  const filtered =
    filter === "All"
      ? sourceImages
      : sourceImages.filter((img) => img.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((p) => (p === null ? null : (p + 1) % filtered.length));
  const prevImage = () =>
    setLightboxIndex((p) =>
      p === null ? null : (p - 1 + filtered.length) % filtered.length
    );

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

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
        {filtered.map((img, i) => {
          const isVid = img.isVideo;
          return (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => openLightbox(i)}
              className="group relative block w-full overflow-hidden rounded-2xl shadow-card text-left focus:outline-none"
            >
              <div className="relative aspect-[4/3] bg-navy-950">
                <Image
                  src={img.thumbnail || img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Video Badge */}
                {isVid && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold text-gold backdrop-blur-md shadow-md border border-gold/30">
                    <Play className="h-3 w-3 fill-gold" />
                    <span>VIDEO TOUR</span>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-navy opacity-0 transition-opacity duration-500 group-hover:opacity-95 p-6 text-center">
                {isVid ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-navy shadow-lg transform transition-transform group-hover:scale-110">
                    <Play className="h-7 w-7 fill-navy ml-0.5" />
                  </div>
                ) : (
                  <ZoomIn className="h-10 w-10 text-gold" />
                )}
                <p className="mt-3 font-serif text-lg font-bold text-cream">{img.title}</p>
                <p className="text-xs uppercase tracking-wider text-gold mt-1">
                  {img.category} {isVid && "• Click to Play"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentItem !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="absolute top-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous"
              className="absolute left-4 sm:left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.isVideo && currentItem.youtubeId ? (
                /* YOUTUBE EMBED PLAYER */
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-navy-700/80">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentItem.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={currentItem.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-serif text-xl font-bold text-cream">{currentItem.title}</p>
                    <p className="text-xs uppercase tracking-wider text-gold mt-1">{currentItem.category} • YouTube Video Tour</p>
                  </div>
                </div>
              ) : (
                /* REGULAR IMAGE VIEW */
                <div className="relative h-[75vh] w-[90vw] max-w-5xl">
                  <Image
                    src={currentItem.src}
                    alt={currentItem.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-6 text-center">
                    <p className="font-serif text-xl font-bold text-cream">{currentItem.title}</p>
                    <p className="text-xs uppercase tracking-wider text-gold">{currentItem.category}</p>
                  </div>
                </div>
              )}
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
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
