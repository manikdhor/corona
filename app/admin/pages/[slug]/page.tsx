"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import { getPageAction, savePageAction } from "@/lib/admin/actions";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params?.slug as string;
  const isNew = slugParam === "new";

  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("September 2026");

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isNew && slugParam) {
      (async () => {
        setLoading(true);
        const page = await getPageAction(slugParam);
        if (page) {
          setId(page.id);
          setTitle(page.title || "");
          setSlug(page.slug || "");
          setContent(page.content || "");
          setIsPublished(page.isPublished !== false);
          setLastUpdated(page.lastUpdated || "September 2026");
        } else {
          setErrorMsg("Page not found.");
        }
        setLoading(false);
      })();
    }
  }, [slugParam, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-")
          .slice(0, 80)
      );
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    const res = await savePageAction({
      id: isNew ? undefined : id,
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      isPublished,
      lastUpdated: lastUpdated.trim() || null,
    });
    setSaving(false);

    if (res.success && res.page) {
      setSuccessMsg("Page saved successfully.");
      if (isNew) {
        router.push(`/admin/pages/${res.page.slug}`);
      } else {
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } else {
      setErrorMsg(res.error || "Failed to save page.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-navy-400">
        Loading document editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="rounded-xl border border-navy-200 bg-white p-2 text-navy-600 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              {isNew ? "New Document" : "Edit Document"}
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              {title || (isNew ? "Untitled Document" : "Edit Page")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && slug && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Eye className="h-3.5 w-3.5 text-navy-400" />
              Preview Live
            </Link>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-gold" />
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-800 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Privacy Policy & Data Governance"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-sm font-semibold text-navy focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                Route Path / Slug *
              </label>
              <div className="flex items-center rounded-xl border border-navy-200 bg-slate-50/50 px-3 py-1.5 focus-within:border-gold focus-within:bg-white">
                <span className="text-xs text-navy-400 select-none">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="privacy-policy"
                  className="w-full bg-transparent pl-1 text-xs font-mono text-navy focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                Document Content *
              </label>
              <span className="text-[11px] text-navy-400">
                WYSIWYG editor supporting legal clauses, tables, and lists
              </span>
            </div>

            <RichTextEditor
              content={content}
              onChange={(html) => setContent(html)}
              placeholder="Write or paste your legal text here..."
            />
          </div>
        </div>

        {/* Settings Side Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-gold-700" />
              Document Status
            </h3>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Visibility</label>
              <select
                value={isPublished ? "published" : "draft"}
                onChange={(e) => setIsPublished(e.target.value === "published")}
                className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="published">Published (Public Accessible)</option>
                <option value="draft">Draft (Private / Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Last Revision Date</label>
              <input
                type="text"
                value={lastUpdated}
                onChange={(e) => setLastUpdated(e.target.value)}
                placeholder="e.g. September 2026"
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
