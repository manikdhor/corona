"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import { adminStore, AdminSiteContent, AdminFaq } from "@/lib/admin/seed";
import { updateSiteContentAction, saveFaqAction, deleteFaqAction } from "@/lib/admin/actions";
import ImageInput from "@/components/admin/media/ImageInput";

const DEFAULT_CORE_VALUES = {
  eyebrow: "What Drives Us",
  heading: "Our Core Values",
  subtitle: "The principles that guide every decision, every transaction, and every relationship at Corona Properties.",
  values: [
    { title: "Integrity", description: "Every transaction is transparent, every document is authentic. We build trust through honesty, not just beautiful land.", icon: "ShieldCheck" },
    { title: "Excellence", description: "From site selection to handover, we pursue the highest standard of quality in every detail of land development.", icon: "TrendingUp" },
    { title: "Client First", description: "Your goals are our goals. We measure our success by the satisfaction and prosperity of the families we serve.", icon: "Handshake" },
    { title: "Innovation", description: "We embrace modern planning, sustainable infrastructure, and forward-thinking design to create lasting value.", icon: "Building2" },
  ],
};

const DEFAULT_JOURNEY = {
  eyebrow: "Our Journey",
  heading: "Milestones That Define Us",
  subtitle: "From a single office in Gulshan to becoming one of Bangladesh's most trusted land developers.",
  milestones: [
    { year: "Inception", title: "The Beginning", text: "Corona Properties launched with a vision to bring transparency to Bangladesh's land market." },
    { year: "Growth", title: "First 100 Families", text: "Crossed our first 100 happy families with our Gulshan and Banani projects." },
    { year: "Expansion", title: "Expansion", text: "Expanded to Uttara, Bashundhara, and Baridhara with premium community projects." },
    { year: "Scale", title: "500+ Acres", text: "Crossed 500 acres of developed land with 1,000+ satisfied property owners." },
    { year: "Future", title: "Leading the Future", text: "Today, Corona Properties is one of the most trusted names in residential land development." },
  ],
};

const DEFAULT_LEAD_CAPTURE = {
  eyebrow: "Get Started",
  heading: "Begin Your Land Ownership Journey",
  description: "Ready to invest in premium residential land? Our team will provide personalized recommendations and guide you through every step — from plot selection to registration.",
  bullets: [
    "Free consultation with land experts",
    "Curated property recommendations",
    "Fully documented plots",
    "Zero obligation, transparent process",
  ],
  formTitle: "Request a Consultation",
  formSubtitle: "Share your details and our specialists will reach out within 24 hours with curated options tailored to your needs.",
};

export default function ContentManagerPage() {
  const [activeTab, setActiveTab] = useState<
    "hero" | "about" | "values" | "journey" | "leadCapture" | "genesis" | "why" | "process" | "cta" | "group" | "faqs"
  >("hero");

  const [content, setContent] = useState<AdminSiteContent>(() => {
    const raw = adminStore.getSiteContent();
    return {
      ...raw,
      coreValues: raw.coreValues || DEFAULT_CORE_VALUES,
      journey: raw.journey || DEFAULT_JOURNEY,
      leadCapture: raw.leadCapture || DEFAULT_LEAD_CAPTURE,
    };
  });
  const [faqs, setFaqs] = useState<AdminFaq[]>(adminStore.getFaqs());
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<AdminFaq> | null>(null);

  const notifySaved = (section: string) => {
    setSavedSuccess(`${section} updated and published successfully!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleSaveSection = async (section: keyof AdminSiteContent) => {
    await updateSiteContentAction(section, content[section]);
    notifySaved(section.toUpperCase());
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) return;
    const res = await saveFaqAction(editingFaq);
    if (res.success) {
      setFaqs(adminStore.getFaqs());
      setEditingFaq(null);
      notifySaved("FAQ");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    await deleteFaqAction(id);
    setFaqs(adminStore.getFaqs());
    notifySaved("FAQ Deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Frontend CMS & Sections
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Site Content & Section Manager
          </h1>
          <p className="text-xs text-navy-400">
            Manage all marketing copy, hero slideshows, why choose us pillars, process milestones, FAQs, and corporate profiles.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {savedSuccess}
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-1.5 border-b border-navy-100 bg-white p-2 rounded-2xl shadow-xs">
        {[
          { id: "hero", label: "Hero Slider" },
          { id: "about", label: "About Teaser" },
          { id: "values", label: "Core Values" },
          { id: "journey", label: "Journey Milestones" },
          { id: "leadCapture", label: "Lead Capture Copy" },
          { id: "genesis", label: "Genesis Story" },
          { id: "why", label: "Why Choose Us" },
          { id: "process", label: "4-Step Process" },
          { id: "cta", label: "CTA Banners" },
          { id: "group", label: "Corona Group" },
          { id: "faqs", label: "FAQs" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === tab.id
                ? "bg-navy text-gold shadow-xs font-bold"
                : "text-navy-600 hover:bg-slate-50 hover:text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO SLIDER */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-50 pb-3">
              <h3 className="font-serif font-bold text-sm text-navy">Homepage Hero Slideshow & Headlines</h3>
              <button
                type="button"
                onClick={() => handleSaveSection("hero")}
                className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
              >
                <Save className="h-3.5 w-3.5" /> Save Hero Section
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Eyebrow Badge Text</label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, eyebrow: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Main Headline</label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, headline: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold text-navy-700 block mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={content.hero.primaryCtaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Primary CTA Button URL</label>
                <input
                  type="text"
                  value={content.hero.primaryCtaLink}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaLink: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-mono"
                />
              </div>
            </div>

            {/* Slides Array */}
            <div className="pt-4 border-t border-navy-50">
              <label className="font-semibold text-xs text-navy-700 block mb-2">
                Background Slideshow Images (Rotates every 5 seconds)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.hero.slides.map((slide, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <ImageInput
                      label={`Slide ${idx + 1}`}
                      value={slide}
                      onChange={(url) => {
                        const next = [...content.hero.slides];
                        next[idx] = url;
                        setContent({ ...content, hero: { ...content.hero, slides: next } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Counter Stats */}
            <div className="pt-4 border-t border-navy-50">
              <label className="font-semibold text-xs text-navy-700 block mb-2">
                Hero Bottom 4 Counter Stats
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {content.hero.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-navy-100 bg-slate-50 space-y-2">
                    <div>
                      <span className="text-[10px] text-navy-400 block">Metric Value</span>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const next = [...content.hero.stats];
                          next[idx].value = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, stats: next } });
                        }}
                        className="w-full rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-bold text-navy"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-navy-400 block">Label</span>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const next = [...content.hero.stats];
                          next[idx].label = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, stats: next } });
                        }}
                        className="w-full rounded-lg border border-navy-200 px-2.5 py-1 text-xs text-navy-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT TEASER */}
      {activeTab === "about" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Homepage About Teaser Section</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("aboutTeaser")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save About Teaser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={content.aboutTeaser.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Section Heading</label>
              <input
                type="text"
                value={content.aboutTeaser.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, heading: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Paragraph 1</label>
              <textarea
                rows={2}
                value={content.aboutTeaser.p1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, p1: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Paragraph 2</label>
              <textarea
                rows={2}
                value={content.aboutTeaser.p2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, p2: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Floating Badge Stat</label>
              <input
                type="text"
                value={content.aboutTeaser.badgeValue}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, badgeValue: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Floating Badge Caption</label>
              <input
                type="text"
                value={content.aboutTeaser.badgeLabel}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutTeaser: { ...content.aboutTeaser, badgeLabel: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-navy-50">
            <ImageInput
              label="Display Image"
              value={content.aboutTeaser.image}
              onChange={(url) =>
                setContent({
                  ...content,
                  aboutTeaser: { ...content.aboutTeaser, image: url },
                })
              }
            />
          </div>

          <div className="pt-3 border-t border-navy-50">
            <label className="font-semibold text-xs text-navy-700 block mb-2">4 Bullet Points</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {content.aboutTeaser.bullets.map((bullet, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={bullet}
                  onChange={(e) => {
                    const next = [...content.aboutTeaser.bullets];
                    next[idx] = e.target.value;
                    setContent({
                      ...content,
                      aboutTeaser: { ...content.aboutTeaser, bullets: next },
                    });
                  }}
                  className="rounded-xl border border-navy-200 px-3 py-2 text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CORE VALUES */}
      {activeTab === "values" && content.coreValues && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Our Core Values (About Page)</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("coreValues")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Core Values
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={content.coreValues.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreValues: { ...content.coreValues!, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.coreValues.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreValues: { ...content.coreValues!, heading: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Subtitle</label>
              <input
                type="text"
                value={content.coreValues.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreValues: { ...content.coreValues!, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-navy-700">Value Cards</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...(content.coreValues?.values || [])];
                  next.push({
                    title: "New Value",
                    description: "Describe the core principle and how it drives your company.",
                    icon: "ShieldCheck",
                  });
                  setContent({
                    ...content,
                    coreValues: { ...content.coreValues!, values: next },
                  });
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add Value Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {content.coreValues.values.map((val, idx) => (
                <div key={idx} className="rounded-xl border border-navy-100 bg-slate-50 p-4 space-y-2 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const next = content.coreValues!.values.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        coreValues: { ...content.coreValues!, values: next },
                      });
                    }}
                    className="absolute top-2 right-2 p-1 text-navy-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="text-[11px]">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold">Title</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const next = [...content.coreValues!.values];
                        next[idx].title = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues!, values: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2 py-1 text-xs font-medium"
                    />
                  </div>

                  <div className="text-[11px]">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold">Icon</label>
                    <select
                      value={val.icon}
                      onChange={(e) => {
                        const next = [...content.coreValues!.values];
                        next[idx].icon = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues!, values: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2 py-1 text-xs"
                    >
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Handshake">Handshake</option>
                      <option value="Building2">Building2</option>
                      <option value="Award">Award</option>
                      <option value="Users">Users</option>
                      <option value="Target">Target</option>
                    </select>
                  </div>

                  <div className="text-[11px]">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold">Description</label>
                    <textarea
                      rows={3}
                      value={val.description}
                      onChange={(e) => {
                        const next = [...content.coreValues!.values];
                        next[idx].description = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues!, values: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy-600 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: JOURNEY MILESTONES */}
      {activeTab === "journey" && content.journey && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Journey Milestones (About Page Timeline)</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("journey")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Milestones
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={content.journey.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    journey: { ...content.journey!, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.journey.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    journey: { ...content.journey!, heading: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Subtitle</label>
              <input
                type="text"
                value={content.journey.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    journey: { ...content.journey!, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-navy-700">Timeline Milestones</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...(content.journey?.milestones || [])];
                  next.push({
                    year: "New Year",
                    title: "Milestone Title",
                    text: "Description of what was achieved.",
                  });
                  setContent({
                    ...content,
                    journey: { ...content.journey!, milestones: next },
                  });
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2">
              {content.journey.milestones.map((m, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start gap-3 p-3.5 rounded-xl border border-navy-100 bg-slate-50 relative group">
                  <div className="w-full sm:w-32">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold block mb-0.5">Year / Era</label>
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => {
                        const next = [...content.journey!.milestones];
                        next[idx].year = e.target.value;
                        setContent({ ...content, journey: { ...content.journey!, milestones: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2 py-1.5 text-xs font-bold text-gold-700"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold block mb-0.5">Title</label>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => {
                        const next = [...content.journey!.milestones];
                        next[idx].title = e.target.value;
                        setContent({ ...content, journey: { ...content.journey!, milestones: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2 py-1.5 text-xs font-medium"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-[10px] text-navy-400 uppercase font-semibold block mb-0.5">Description</label>
                    <input
                      type="text"
                      value={m.text}
                      onChange={(e) => {
                        const next = [...content.journey!.milestones];
                        next[idx].text = e.target.value;
                        setContent({ ...content, journey: { ...content.journey!, milestones: next } });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = content.journey!.milestones.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        journey: { ...content.journey!, milestones: next },
                      });
                    }}
                    className="p-1.5 text-navy-300 hover:text-rose-500 self-end sm:self-center transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: LEAD CAPTURE COPY */}
      {activeTab === "leadCapture" && content.leadCapture && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Lead Capture Section Copy (Homepage & About)</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("leadCapture")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Lead Capture Copy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={content.leadCapture.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    leadCapture: { ...content.leadCapture!, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Heading</label>
              <input
                type="text"
                value={content.leadCapture.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    leadCapture: { ...content.leadCapture!, heading: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-semibold text-navy-700 block mb-1">Description Paragraph</label>
            <textarea
              rows={3}
              value={content.leadCapture.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  leadCapture: { ...content.leadCapture!, description: e.target.value },
                })
              }
              className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Form Card Title</label>
              <input
                type="text"
                value={content.leadCapture.formTitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    leadCapture: { ...content.leadCapture!, formTitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Form Card Subtitle</label>
              <input
                type="text"
                value={content.leadCapture.formSubtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    leadCapture: { ...content.leadCapture!, formSubtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-navy-700">Checklist Highlights</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...(content.leadCapture?.bullets || [])];
                  next.push("New bullet highlight");
                  setContent({
                    ...content,
                    leadCapture: { ...content.leadCapture!, bullets: next },
                  });
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add Highlight
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {content.leadCapture.bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const next = [...content.leadCapture!.bullets];
                      next[idx] = e.target.value;
                      setContent({ ...content, leadCapture: { ...content.leadCapture!, bullets: next } });
                    }}
                    className="flex-1 rounded-xl border border-navy-200 px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = content.leadCapture!.bullets.filter((_, i) => i !== idx);
                      setContent({ ...content, leadCapture: { ...content.leadCapture!, bullets: next } });
                    }}
                    className="p-1.5 text-navy-300 hover:text-rose-500 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GENESIS STORY */}
      {activeTab === "genesis" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Origin Story: From Toronto to Purbachal</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("genesis")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Genesis Story
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={content.genesis.eyebrow}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, eyebrow: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Headline</label>
              <input
                type="text"
                value={content.genesis.heading}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, heading: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Center Inspirational Quote</label>
              <input
                type="text"
                value={content.genesis.quote}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, quote: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none font-serif italic"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Paragraph 1</label>
              <textarea
                rows={2}
                value={content.genesis.p1}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, p1: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Paragraph 2</label>
              <textarea
                rows={2}
                value={content.genesis.p2}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, p2: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Paragraph 3</label>
              <textarea
                rows={2}
                value={content.genesis.p3}
                onChange={(e) =>
                  setContent({ ...content, genesis: { ...content.genesis, p3: e.target.value } })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-navy-50">
            <ImageInput
              label="Genesis Story Image"
              value={content.genesis.image}
              onChange={(url) =>
                setContent({ ...content, genesis: { ...content.genesis, image: url } })
              }
            />
          </div>
        </div>
      )}

      {/* TAB 4: WHY CHOOSE US */}
      {activeTab === "why" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Why Corona Properties (Value Pillars)</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("whyChooseUs")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Pillars
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={content.whyChooseUs.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    whyChooseUs: { ...content.whyChooseUs, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.whyChooseUs.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    whyChooseUs: { ...content.whyChooseUs, heading: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-navy-700">Pillar Cards</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...content.whyChooseUs.reasons];
                  next.push({
                    icon: "ShieldCheck",
                    title: "New Value Pillar",
                    description: "Description of your company assurance or infrastructure quality.",
                  });
                  setContent({
                    ...content,
                    whyChooseUs: { ...content.whyChooseUs, reasons: next },
                  });
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {content.whyChooseUs.reasons.map((reason, idx) => (
                <div key={idx} className="rounded-xl border border-navy-100 bg-slate-50 p-4 space-y-2 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const next = content.whyChooseUs.reasons.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        whyChooseUs: { ...content.whyChooseUs, reasons: next },
                      });
                    }}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={reason.title}
                    placeholder="Title"
                    onChange={(e) => {
                      const next = [...content.whyChooseUs.reasons];
                      next[idx].title = e.target.value;
                      setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, reasons: next } });
                    }}
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-bold text-navy"
                  />
                  <textarea
                    rows={3}
                    value={reason.description}
                    placeholder="Description"
                    onChange={(e) => {
                      const next = [...content.whyChooseUs.reasons];
                      next[idx].description = e.target.value;
                      setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, reasons: next } });
                    }}
                    className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 4-STEP PROCESS */}
      {activeTab === "process" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">4-Step Ownership Journey</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("process")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Process
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.process.steps.map((step, idx) => (
              <div key={idx} className="rounded-xl border border-navy-100 bg-slate-50 p-4 space-y-2">
                <span className="font-serif font-black text-gold text-lg">Step {step.step}</span>
                <input
                  type="text"
                  value={step.title}
                  placeholder="Step Title"
                  onChange={(e) => {
                    const next = [...content.process.steps];
                    next[idx].title = e.target.value;
                    setContent({ ...content, process: { ...content.process, steps: next } });
                  }}
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-bold text-navy"
                />
                <textarea
                  rows={4}
                  value={step.description}
                  placeholder="Description"
                  onChange={(e) => {
                    const next = [...content.process.steps];
                    next[idx].description = e.target.value;
                    setContent({ ...content, process: { ...content.process, steps: next } });
                  }}
                  className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CTA BANNERS */}
      {activeTab === "cta" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <h3 className="font-serif font-bold text-sm text-navy">Call to Action Banner</h3>
            <button
              type="button"
              onClick={() => handleSaveSection("ctaBanner")}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save CTA Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-navy-700 block mb-1">Banner Title</label>
              <input
                type="text"
                value={content.ctaBanner.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaBanner: { ...content.ctaBanner, title: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>

            <div>
              <label className="font-semibold text-navy-700 block mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={content.ctaBanner.phone}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaBanner: { ...content.ctaBanner, phone: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-navy-700 block mb-1">Banner Subtitle</label>
              <textarea
                rows={2}
                value={content.ctaBanner.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaBanner: { ...content.ctaBanner, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-navy-50">
            <ImageInput
              label="Banner Background Image"
              value={content.ctaBanner.bgImage}
              onChange={(url) =>
                setContent({
                  ...content,
                  ctaBanner: { ...content.ctaBanner, bgImage: url },
                })
              }
            />
          </div>
        </div>
      )}

      {/* TAB 7: CORONA GROUP CORPORATE */}
      {activeTab === "group" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-50 pb-3">
              <h3 className="font-serif font-bold text-sm text-navy">Corona Group Profile & Sister Concerns</h3>
              <button
                type="button"
                onClick={() => handleSaveSection("corporateGroup")}
                className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
              >
                <Save className="h-3.5 w-3.5" /> Save Group Profile
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Founding Pioneer Tribute</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Pioneer Name</label>
                  <input
                    type="text"
                    value={content.corporateGroup.foundingPioneer.name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        corporateGroup: {
                          ...content.corporateGroup,
                          foundingPioneer: {
                            ...content.corporateGroup.foundingPioneer,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-navy-700 block mb-1">Title / Honorific</label>
                  <input
                    type="text"
                    value={content.corporateGroup.foundingPioneer.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        corporateGroup: {
                          ...content.corporateGroup,
                          foundingPioneer: {
                            ...content.corporateGroup.foundingPioneer,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-navy-200 px-3.5 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Sister Concerns */}
            <div className="pt-4 border-t border-navy-50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">
                Sister Concerns ({content.corporateGroup.sisterConcerns.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.corporateGroup.sisterConcerns.map((sc, idx) => (
                  <div key={sc.id} className="p-4 rounded-xl border border-navy-100 bg-slate-50 space-y-2 text-xs">
                    <input
                      type="text"
                      value={sc.name}
                      placeholder="Company Name"
                      onChange={(e) => {
                        const next = [...content.corporateGroup.sisterConcerns];
                        next[idx].name = e.target.value;
                        setContent({
                          ...content,
                          corporateGroup: { ...content.corporateGroup, sisterConcerns: next },
                        });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1.5 font-bold text-navy"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={sc.established}
                        placeholder="Year"
                        onChange={(e) => {
                          const next = [...content.corporateGroup.sisterConcerns];
                          next[idx].established = Number(e.target.value);
                          setContent({
                            ...content,
                            corporateGroup: { ...content.corporateGroup, sisterConcerns: next },
                          });
                        }}
                        className="rounded-lg border border-navy-200 px-2 py-1 font-mono"
                      />
                      <input
                        type="text"
                        value={sc.tagline}
                        placeholder="Tagline"
                        onChange={(e) => {
                          const next = [...content.corporateGroup.sisterConcerns];
                          next[idx].tagline = e.target.value;
                          setContent({
                            ...content,
                            corporateGroup: { ...content.corporateGroup, sisterConcerns: next },
                          });
                        }}
                        className="rounded-lg border border-navy-200 px-2 py-1"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={sc.description}
                      placeholder="Description"
                      onChange={(e) => {
                        const next = [...content.corporateGroup.sisterConcerns];
                        next[idx].description = e.target.value;
                        setContent({
                          ...content,
                          corporateGroup: { ...content.corporateGroup, sisterConcerns: next },
                        });
                      }}
                      className="w-full rounded-lg border border-navy-200 px-2.5 py-1 text-navy-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: FAQS ACCORDION */}
      {activeTab === "faqs" && (
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-navy-100 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-50 pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-navy">Frequently Asked Questions</h3>
              <p className="text-xs text-navy-400">Questions displayed on the public Contact page.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingFaq({ question: "", answer: "", category: "General", sortOrder: faqs.length + 1 })}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-gold hover:bg-navy-800 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add New FAQ
            </button>
          </div>

          {editingFaq && (
            <form onSubmit={handleSaveFaq} className="p-4 rounded-xl border border-gold/40 bg-gold/5 space-y-3 text-xs">
              <h4 className="font-bold text-navy text-sm">
                {editingFaq.id ? "Edit Question & Answer" : "Add New Question"}
              </h4>
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Answer</label>
                <textarea
                  required
                  rows={3}
                  value={editingFaq.answer || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="rounded-xl border border-navy-200 px-3.5 py-1.5 text-xs text-navy-600 hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy px-4 py-1.5 text-xs font-semibold text-gold hover:bg-navy-800"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="flex items-start justify-between p-4 rounded-xl border border-navy-100 bg-slate-50/60 hover:bg-white transition"
              >
                <div className="space-y-1 pr-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-700 block">
                    {faq.category}
                  </span>
                  <h4 className="font-serif font-bold text-navy text-sm">{faq.question}</h4>
                  <p className="text-xs text-navy-500 leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(faq)}
                    className="p-1.5 text-navy-400 hover:text-navy transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
