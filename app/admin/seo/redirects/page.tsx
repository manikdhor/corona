"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  ArrowLeft,
} from "lucide-react";
import { RedirectRule } from "@/lib/admin/seed";
import { getRedirectsAction, saveRedirectAction, deleteRedirectAction } from "@/lib/admin/actions";

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRedirects = async () => {
    try {
      const data = await getRedirectsAction();
      setRedirects(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadRedirects();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [sourcePath, setSourcePath] = useState("");
  const [targetPath, setTargetPath] = useState("");
  const [statusCode, setStatusCode] = useState(301);

  // Sample 404 Broken-Link Monitor
  const [brokenLinks, setBrokenLinks] = useState([
    { url: "/purbachal-plots-2025", hits: 48, referrer: "google.com" },
    { url: "/mapleleaf-brochure.pdf", hits: 24, referrer: "facebook.com" },
    { url: "/gulshan-lake-view", hits: 19, referrer: "direct" },
  ]);

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePath || !targetPath) return;

    await saveRedirectAction({
      sourcePath: sourcePath.startsWith("/") ? sourcePath : `/${sourcePath}`,
      targetPath,
      statusCode,
      isActive: true,
    });

    await loadRedirects();
    setShowAddModal(false);
    setSourcePath("");
    setTargetPath("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this redirect rule?")) {
      await deleteRedirectAction(id);
      await loadRedirects();
    }
  };

  const handleQuickFix404 = (url: string) => {
    setSourcePath(url);
    setTargetPath("/properties");
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/seo"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              URL Routing & Link Equity
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              301 Redirects & 404 Monitor
            </h1>
            <p className="text-xs text-navy-400">
              Preserve search equity and eliminate broken links with permanent and temporary URL routing rules.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-semibold text-gold hover:bg-navy-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Redirect
        </button>
      </div>

      {/* 404 BROKEN LINK DETECTOR BANNER */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif font-bold text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            404 Error Monitor (Recent Unresolved Traffic)
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">3 Unhandled 404 URLs</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Visitors or search crawlers encountered the following missing pages. Create 1-click 301 redirects to recover lost prospective buyers.
        </p>

        <div className="divide-y divide-amber-200/60 rounded-xl bg-white border border-amber-200 overflow-hidden">
          {brokenLinks.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 text-xs">
              <div>
                <span className="font-mono font-bold text-navy-900">{item.url}</span>
                <span className="text-navy-400 ml-3">
                  {item.hits} 404 hits &bull; Source: {item.referrer}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickFix404(item.url)}
                className="rounded-lg bg-navy px-3 py-1 text-xs font-semibold text-gold hover:bg-navy-800 transition"
              >
                + Create 301 Redirect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REDIRECT RULES TABLE */}
      <div className="rounded-2xl bg-white shadow-xs border border-navy-100 overflow-hidden">
        <div className="border-b border-navy-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-navy">
            Active Redirect Rules ({redirects.length})
          </h3>
        </div>

        <div className="divide-y divide-navy-50">
          {redirects.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 px-6 text-xs hover:bg-slate-50/60">
              <div className="flex items-center gap-4">
                <span className="rounded bg-navy-50 px-2 py-0.5 text-[10px] font-bold text-navy font-mono">
                  {r.statusCode}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-navy-800">{r.sourcePath}</span>
                  <ArrowRight className="h-3 w-3 text-gold-700" />
                  <span className="font-mono text-gold-800">{r.targetPath}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[11px] text-navy-400 font-medium">
                  {r.hitCount} redirects logged
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded-lg text-navy-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete Redirect"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-navy-100">
            <h3 className="text-base font-serif font-bold text-navy">Create Redirect Rule</h3>
            <p className="text-xs text-navy-400 mt-1">
              Traffic visiting the source URL will be automatically sent to the target URL.
            </p>

            <form onSubmit={handleSaveRedirect} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-navy-700 block mb-1">Source Path (Old URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="/old-plots"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="w-full font-mono rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">Target Path (New URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="/properties/maple-leaf-garden-city"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="w-full font-mono rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold text-navy-700 block mb-1">HTTP Redirect Status</label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 outline-none focus:border-gold font-bold text-navy"
                >
                  <option value={301}>301 — Permanent Redirect (SEO Recommended)</option>
                  <option value={302}>302 — Temporary Redirect</option>
                  <option value={307}>307 — Temporary Redirect (Method Preserved)</option>
                  <option value={308}>308 — Permanent Redirect (Method Preserved)</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-navy-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-navy-600 hover:bg-navy-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-gold hover:bg-navy-800 shadow-sm"
                >
                  Save Redirect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
