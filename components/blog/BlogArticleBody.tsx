"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Languages, Camera } from "lucide-react";

export interface InlineImage {
  src: string;
  caption?: string;
  alt?: string;
}

interface BlogArticleBodyProps {
  title: string;
  titleBn?: string | null;
  excerpt: string;
  excerptBn?: string | null;
  content: string | string[];
  contentBn?: string | null;
  author: string;
  authorRole: string;
  inlineImages?: InlineImage[];
  featuredImage?: string;
}

function renderFormattedParagraph(paragraph: string) {
  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function injectInlineImagesIntoHtml(html: string, images: InlineImage[]): string {
  if (!images || images.length === 0) return html;
  // If the HTML already has images or figures explicitly placed by the author, don't duplicate
  if (html.includes("<img") || html.includes("<figure")) return html;

  const pCloseRegex = /<\/p>/gi;
  let pCount = 0;
  let imgIdx = 0;

  return html.replace(pCloseRegex, (match) => {
    pCount++;
    // Insert after 2nd paragraph and 4th paragraph
    if ((pCount === 2 || pCount === 4) && imgIdx < images.length) {
      const img = images[imgIdx++];
      const captionHtml = img.caption
        ? `<figcaption class="py-3 px-5 text-center text-xs md:text-sm text-navy-500 italic bg-navy-50/60 border-t border-navy-100/60">${img.caption}</figcaption>`
        : "";
      return `</p><figure class="my-10 overflow-hidden rounded-2xl md:rounded-3xl border border-navy-100 shadow-xl bg-white"><div class="relative w-full aspect-[16/9] overflow-hidden"><img src="${img.src}" alt="${img.alt || img.caption || 'Article visual'}" class="w-full h-full object-cover my-0 rounded-none shadow-none" loading="lazy" /></div>${captionHtml}</figure>`;
    }
    return match;
  });
}

export default function BlogArticleBody({
  title,
  titleBn,
  excerpt,
  excerptBn,
  content,
  contentBn,
  author,
  authorRole,
  inlineImages = [],
  featuredImage,
}: BlogArticleBodyProps) {
  const hasBangla = !!(contentBn || titleBn || excerptBn);
  const [lang, setLang] = useState<"en" | "bn">("en");

  const activeExcerpt = lang === "bn" && excerptBn ? excerptBn : excerpt;
  const activeContent = lang === "bn" && contentBn ? contentBn : content;

  // Curate default high-quality inline images if none specifically supplied
  const effectiveInlineImages: InlineImage[] =
    inlineImages.length > 0
      ? inlineImages
      : [
          {
            src: "/Toronto_to_Purbachal.webp",
            caption: "Strategic connectivity and master-planned road networks surrounding Corona residential estates.",
            alt: "Purbachal connectivity and master layout",
          },
          {
            src: "/image-02.webp",
            caption: "Delineated residential plots with underground utilities and wide internal avenues.",
            alt: "Planned residential community plots",
          },
        ];

  const processedHtml =
    typeof activeContent === "string"
      ? injectInlineImagesIntoHtml(activeContent, effectiveInlineImages)
      : "";

  return (
    <div>
      {/* Language Switcher if bilingual content exists */}
      {hasBangla && (
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-4 border border-navy-100 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-navy-600">
            <Languages className="h-4 w-4 text-gold-700" />
            <span>Article available in multiple languages:</span>
          </div>
          <div className="inline-flex rounded-xl bg-navy-50 p-1 border border-navy-100 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                lang === "en"
                  ? "bg-navy text-gold shadow-xs font-bold"
                  : "text-navy-500 hover:text-navy"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("bn")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                lang === "bn"
                  ? "bg-navy text-gold shadow-xs font-bold"
                  : "text-navy-500 hover:text-navy"
              }`}
            >
              বাংলা (Bangla)
            </button>
          </div>
        </div>
      )}

      {/* Excerpt Callout */}
      {activeExcerpt && (
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-l-4 border-gold p-6 md:p-8">
          <p className="font-serif text-xl sm:text-2xl leading-relaxed text-navy italic">
            &ldquo;{activeExcerpt}&rdquo;
          </p>
        </div>
      )}

      {/* Body Content */}
      <div className="space-y-6">
        {Array.isArray(activeContent) ? (
          activeContent.map((paragraph: string, i: number) => {
            const showFirstImage = i === 1 && effectiveInlineImages[0];
            const showSecondImage = i === 3 && effectiveInlineImages[1];

            return (
              <React.Fragment key={i}>
                <p className="text-base sm:text-lg leading-relaxed text-navy-600">
                  {renderFormattedParagraph(paragraph)}
                </p>

                {showFirstImage && (
                  <figure className="my-10 overflow-hidden rounded-2xl md:rounded-3xl border border-navy-100 shadow-xl bg-white">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={effectiveInlineImages[0].src}
                        alt={effectiveInlineImages[0].alt || effectiveInlineImages[0].caption || title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                    {effectiveInlineImages[0].caption && (
                      <figcaption className="py-3 px-5 text-center text-xs md:text-sm text-navy-500 italic bg-navy-50/60 border-t border-navy-100/60">
                        {effectiveInlineImages[0].caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {showSecondImage && (
                  <figure className="my-10 overflow-hidden rounded-2xl md:rounded-3xl border border-navy-100 shadow-xl bg-white">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={effectiveInlineImages[1].src}
                        alt={effectiveInlineImages[1].alt || effectiveInlineImages[1].caption || title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                    {effectiveInlineImages[1].caption && (
                      <figcaption className="py-3 px-5 text-center text-xs md:text-sm text-navy-500 italic bg-navy-50/60 border-t border-navy-100/60">
                        {effectiveInlineImages[1].caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </React.Fragment>
            );
          })
        ) : typeof activeContent === "string" && activeContent.includes("<") ? (
          <div
            className="prose prose-lg prose-navy max-w-none text-navy-600 leading-relaxed
              [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-base sm:[&>p]:text-lg
              [&>h2]:font-serif [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-navy [&>h2]:mt-12 [&>h2]:mb-5
              [&>h3]:font-serif [&>h3]:text-xl sm:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-navy [&>h3]:mt-8 [&>h3]:mb-4
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2.5 [&>ul]:mb-6
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2.5 [&>ol]:mb-6
              [&>blockquote]:border-l-4 [&>blockquote]:border-gold [&>blockquote]:bg-navy-50/50 [&>blockquote]:p-6 [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:text-navy-800 [&>blockquote]:my-8 [&>blockquote]:text-lg
              [&_img]:rounded-2xl md:[&_img]:rounded-3xl [&_img]:shadow-xl [&_img]:border [&_img]:border-navy-100/80 [&_img]:my-8 [&_img]:w-full [&_img]:object-cover [&_img]:max-h-[520px]
              [&_figure]:my-10 [&_figure]:rounded-2xl md:[&_figure]:rounded-3xl [&_figure]:overflow-hidden [&_figure]:shadow-xl [&_figure]:border [&_figure]:border-navy-100/80 [&_figure]:bg-white
              [&_figure_img]:my-0 [&_figure_img]:rounded-none [&_figure_img]:shadow-none [&_figure_img]:border-0 [&_figure_img]:max-h-none
              [&_figcaption]:py-3 [&_figcaption]:px-5 [&_figcaption]:text-center [&_figcaption]:text-xs md:[&_figcaption]:text-sm [&_figcaption]:text-navy-500 [&_figcaption]:italic [&_figcaption]:border-t [&_figcaption]:border-navy-100/60 [&_figcaption]:bg-navy-50/60
              [&>a]:text-gold-700 [&>a]:underline [&>a]:font-semibold hover:[&>a]:text-navy"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        ) : (
          <p className="text-base sm:text-lg leading-relaxed text-navy-500 whitespace-pre-line">
            {String(activeContent)}
          </p>
        )}
      </div>
    </div>
  );
}
