"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Shield,
} from "lucide-react";
import { getPagesAction, deletePageAction } from "@/lib/admin/actions";
import { AdminPage } from "@/lib/admin/seed";

export default function PagesAdminPage() {
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadPages = async () => {
    setLoading(true);
    const data = await getPagesAction();
    setPages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the page "${title}"?`)) return;
    const res = await deletePageAction(id);
    if (res.success) {
      setPages((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Page "${title}" removed.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Legal & Static CMS
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Pages & Regulatory Documents
          </h1>
          <p className="text-xs text-navy-400">
            Manage Privacy Policy, Terms & Conditions, Refund Policies, Disclaimers, and custom CMS pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages/new"
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
          >
            <Plus className="h-4 w-4 text-gold" />
            Create Page
          </Link>
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

      {/* Pages Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-navy-400">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-navy-200" />
            <h3 className="mt-3 text-sm font-bold text-navy">No custom pages found</h3>
            <p className="text-xs text-navy-400 mt-1">Create legal, privacy, or policy documents.</p>
            <Link
              href="/admin/pages/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
            >
              <Plus className="h-3.5 w-3.5 text-gold" /> Create Page
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-navy-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-navy-500">
                <th className="py-3 px-4">Page Title</th>
                <th className="py-3 px-4">Route / URL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Revised</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-navy">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold-700 shrink-0" />
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-navy-500">
                    /{p.slug}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {p.isPublished ? (
                        <>
                          <Eye className="h-3 w-3" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-navy-400 whitespace-nowrap">
                    {p.lastUpdated || "Not specified"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/${p.slug}`}
                        target="_blank"
                        title="View Live"
                        className="rounded-lg p-1.5 text-navy-400 hover:bg-slate-100 hover:text-navy transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/pages/${p.slug}`}
                        title="Edit Page"
                        className="rounded-lg p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        title="Delete Page"
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
