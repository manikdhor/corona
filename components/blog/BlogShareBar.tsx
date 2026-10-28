"use client";

import React, { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface BlogShareBarProps {
  title: string;
  slug: string;
}

export default function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://coronapropertiesltd.com/blog/${slug}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(`${title} - ${getUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareLinkedin = () => {
    const url = encodeURIComponent(getUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(title);
    const url = encodeURIComponent(getUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-400 mr-1">
        <Share2 className="h-3.5 w-3.5 text-gold-600" />
        Share:
      </span>

      <button
        type="button"
        onClick={copyToClipboard}
        title="Copy article link"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition border ${
          copied
            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
            : "bg-white text-navy-600 border-navy-100 hover:border-gold hover:text-navy shadow-xs"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={shareWhatsapp}
        title="Share on WhatsApp"
        className="rounded-full bg-white p-2 text-navy-500 border border-navy-100 hover:border-emerald-500 hover:text-emerald-600 transition shadow-xs"
      >
        <span className="sr-only">WhatsApp</span>
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.948 2.791.948 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.502-4.469 9.969-9.969 9.969-1.758 0-3.415-.461-4.867-1.267l-5.164 1.36 1.385-5.064c-.908-1.503-1.423-3.264-1.423-5.048 0-5.502 4.469-9.969 9.969-9.969 5.501 0 9.969 4.467 9.969 9.969z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={shareLinkedin}
        title="Share on LinkedIn"
        className="rounded-full bg-white p-2 text-navy-500 border border-navy-100 hover:border-blue-600 hover:text-blue-600 transition shadow-xs"
      >
        <span className="sr-only">LinkedIn</span>
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={shareTwitter}
        title="Share on X (Twitter)"
        className="rounded-full bg-white p-2 text-navy-500 border border-navy-100 hover:border-navy hover:text-navy transition shadow-xs"
      >
        <span className="sr-only">X</span>
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={shareFacebook}
        title="Share on Facebook"
        className="rounded-full bg-white p-2 text-navy-500 border border-navy-100 hover:border-blue-700 hover:text-blue-700 transition shadow-xs"
      >
        <span className="sr-only">Facebook</span>
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      </button>
    </div>
  );
}
