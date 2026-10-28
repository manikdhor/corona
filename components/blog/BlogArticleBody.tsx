"use client";

import React, { useState } from "react";
import { User, Languages } from "lucide-react";

interface BlogArticleBodyProps {
  title: string;
  titleBn?: string | null;
  excerpt: string;
  excerptBn?: string | null;
  content: string | string[];
  contentBn?: string | null;
  author: string;
  authorRole: string;
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

export default function BlogArticleBody({
  title,
  titleBn,
  excerpt,
  excerptBn,
  content,
  contentBn,
  author,
  authorRole,
}: BlogArticleBodyProps) {
  const hasBangla = !!(contentBn || titleBn || excerptBn);
  const [lang, setLang] = useState<"en" | "bn">("en");

  const activeExcerpt = lang === "bn" && excerptBn ? excerptBn : excerpt;
  const activeContent = lang === "bn" && contentBn ? contentBn : content;

  return (
    <div>
      {/* Language Switcher if bilingual content exists */}
      {hasBangla && (
        <div className="mb-8 flex items-center justify-between border-b border-navy-50 pb-4">
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <Languages className="h-4 w-4 text-gold-700" />
            <span>Article available in multiple languages:</span>
          </div>
          <div className="inline-flex rounded-xl bg-navy-50 p-1 border border-navy-100 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-lg transition ${
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
              className={`px-3 py-1 rounded-lg transition ${
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

      {/* Author Byline */}
      <div className="mb-10 flex items-center gap-4 border-b border-navy-50 pb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold">
          <User className="h-6 w-6 text-navy" />
        </div>
        <div>
          <p className="font-serif text-lg font-bold text-navy">{author || "Corona Team"}</p>
          <p className="text-sm text-navy-400">{authorRole || "Managing Director"}</p>
        </div>
      </div>

      {/* Excerpt Callout */}
      {activeExcerpt && (
        <p className="font-display text-2xl leading-relaxed text-navy-600 italic mb-10 border-l-4 border-gold pl-6">
          {activeExcerpt}
        </p>
      )}

      {/* Body Content */}
      <div className="space-y-6">
        {Array.isArray(activeContent) ? (
          activeContent.map((paragraph: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed text-navy-500">
              {renderFormattedParagraph(paragraph)}
            </p>
          ))
        ) : typeof activeContent === "string" && activeContent.includes("<") ? (
          <div
            className="prose prose-lg prose-navy max-w-none text-navy-600 leading-relaxed
              [&>p]:mb-5 [&>p]:leading-relaxed
              [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-navy [&>h2]:mt-10 [&>h2]:mb-4
              [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-navy [&>h3]:mt-6 [&>h3]:mb-3
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-6
              [&>blockquote]:border-l-4 [&>blockquote]:border-gold [&>blockquote]:bg-navy-50/40 [&>blockquote]:p-5 [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:text-navy-700 [&>blockquote]:my-6
              [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:my-8 [&>img]:w-full [&>img]:object-cover
              [&>a]:text-gold-700 [&>a]:underline [&>a]:font-semibold hover:[&>a]:text-navy"
            dangerouslySetInnerHTML={{ __html: activeContent }}
          />
        ) : (
          <p className="text-lg leading-relaxed text-navy-500 whitespace-pre-line">
            {String(activeContent)}
          </p>
        )}
      </div>
    </div>
  );
}
