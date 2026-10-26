"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  FileCode,
  SlidersHorizontal,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Code,
  FileText,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { getSettingsAction, updateSettingsAction } from "@/lib/admin/actions";

export default function SeoManagerPage() {
  const [activeTab, setActiveTab] = useState<"general" | "robots" | "jsonld">("general");

  // General SEO defaults
  const [defaultTitle, setDefaultTitle] = useState<string>(`${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`);
  const [defaultDesc, setDefaultDesc] = useState<string>(SITE_CONFIG.description);
  const [canonicalBase, setCanonicalBase] = useState<string>(SITE_CONFIG.url);
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  // Robots.txt editor
  const [robotsTxt, setRobotsTxt] = useState(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_CONFIG.url}/api/sitemap`
  );

  // JSON-LD schema override
  const [jsonLdSchema, setJsonLdSchema] = useState(
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: "Corona Properties Limited",
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/image-01.webp`,
        telephone: "+8801805759297",
        email: "cplcoronapropertiesltd@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01",
          addressLocality: "Dhaka",
          postalCode: "1212",
          addressCountry: "BD",
        },
        areaServed: "Bangladesh",
        priceRange: "$$$$",
      },
      null,
      2
    )
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSettingsAction().then((s) => {
      if (s?.seo) {
        if (s.seo.defaultTitle) setDefaultTitle(s.seo.defaultTitle);
        if (s.seo.defaultDesc) setDefaultDesc(s.seo.defaultDesc);
        if (s.seo.canonicalBase) setCanonicalBase(s.seo.canonicalBase);
        if (typeof s.seo.robotsIndex === "boolean") setRobotsIndex(s.seo.robotsIndex);
        if (typeof s.seo.robotsFollow === "boolean") setRobotsFollow(s.seo.robotsFollow);
        if (s.seo.robotsTxt) setRobotsTxt(s.seo.robotsTxt);
        if (s.seo.jsonLdSchema) setJsonLdSchema(s.seo.jsonLdSchema);
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettingsAction("seo", {
      defaultTitle,
      defaultDesc,
      canonicalBase,
      robotsIndex,
      robotsFollow,
      robotsTxt,
      jsonLdSchema,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Quick Links */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Search Engine Optimization
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            SEO & Search Authority Suite
          </h1>
          <p className="text-xs text-navy-400">
            Control metadata defaults, robots directives, dynamic XML sitemaps, and JSON-LD schema graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/seo/redirects"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <SlidersHorizontal className="h-4 w-4 text-gold-700" /> 301 Redirects
          </Link>
          <Link
            href="/admin/seo/scripts"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FileCode className="h-4 w-4 text-gold-700" /> Custom Scripts
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
          >
            <Save className="h-4 w-4" /> Save SEO Settings
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          SEO configuration successfully saved and applied site-wide.
        </div>
      )}

      {/* SITEMAP STATUS BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-xs border border-navy-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold-700">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-navy">Dynamic XML Sitemap Active</h4>
            <p className="text-xs text-navy-400 mt-0.5">
              Automatically auto-regenerated on listing publish &bull; Serving at <code className="font-mono text-gold-800 font-bold">/api/sitemap</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/api/sitemap"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-3.5 py-1.5 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View XML Feed
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-navy-100 bg-white rounded-2xl px-4 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === "general"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          Meta Tag Defaults & SERP
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("robots")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === "robots"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          Robots.txt Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("jsonld")}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === "jsonld"
              ? "border-navy text-navy font-bold"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          JSON-LD Structured Data Schema
        </button>
      </div>

      {/* TAB 1: META TAG DEFAULTS */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <h3 className="font-serif font-bold text-sm text-navy">Global Meta Directives</h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Default Meta Title Template</label>
                <span className="text-[11px] text-navy-400">{defaultTitle.length} chars</span>
              </div>
              <input
                type="text"
                value={defaultTitle}
                onChange={(e) => setDefaultTitle(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-navy-700">Default Meta Description</label>
                <span className="text-[11px] text-navy-400">{defaultDesc.length} chars</span>
              </div>
              <textarea
                rows={3}
                value={defaultDesc}
                onChange={(e) => setDefaultDesc(e.target.value)}
                className="w-full rounded-xl border border-navy-200 p-3 text-xs focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-700 block mb-1">Canonical Base URL</label>
              <input
                type="url"
                value={canonicalBase}
                onChange={(e) => setCanonicalBase(e.target.value)}
                className="w-full font-mono rounded-xl border border-navy-200 px-3.5 py-2 text-xs focus:border-gold outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-navy-50">
              <label className="flex items-center gap-2 text-xs font-semibold text-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  className="rounded border-navy-300 text-gold focus:ring-gold"
                />
                robots: index (Allow search engines to index)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                  className="rounded border-navy-300 text-gold focus:ring-gold"
                />
                robots: follow (Follow hyperlinks)
              </label>
            </div>
          </div>

          {/* SERP PREVIEW */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
              Google SERP Live Preview
            </h4>
            <div className="rounded-xl border border-navy-100 bg-slate-50/60 p-4 space-y-1">
              <span className="text-[11px] text-emerald-800 block truncate font-mono">
                {canonicalBase}
              </span>
              <h5 className="font-medium text-sm text-blue-800 hover:underline cursor-pointer line-clamp-1">
                {defaultTitle}
              </h5>
              <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed">
                {defaultDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROBOTS.TXT EDITOR */}
      {activeTab === "robots" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm text-navy">Live robots.txt Editor</h3>
              <p className="text-xs text-navy-400">
                Directly configure search bot crawling parameters for Googlebot, Bingbot, and AI crawlers.
              </p>
            </div>
          </div>

          <textarea
            rows={8}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            className="w-full font-mono text-xs rounded-xl border border-navy-200 p-4 focus:border-gold outline-none bg-slate-50 text-navy-800"
          />
        </div>
      )}

      {/* TAB 3: JSON-LD SCHEMA */}
      {activeTab === "jsonld" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm text-navy">JSON-LD Structured Data Graph</h3>
              <p className="text-xs text-navy-400">
                Schema.org RealEstateAgent & RealEstateListing definition injected into public site &lt;head&gt;.
              </p>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Valid JSON-LD
            </span>
          </div>

          <textarea
            rows={14}
            value={jsonLdSchema}
            onChange={(e) => setJsonLdSchema(e.target.value)}
            className="w-full font-mono text-xs rounded-xl border border-navy-200 p-4 focus:border-gold outline-none bg-slate-50 text-navy-800"
          />
        </div>
      )}
    </div>
  );
}
