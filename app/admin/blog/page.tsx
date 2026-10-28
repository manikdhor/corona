"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getBlogPostsAction,
  deleteBlogPostAction,
  getCategoriesAction,
} from "@/lib/admin/actions";
import { AdminBlogPost, AdminCategory } from "@/lib/admin/seed";

function formatAdminDate(dateStr?: string | null) {
  if (!dateStr) return "Not set";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split("T")[0];
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [blogCats, setBlogCats] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    const [data, cats] = await Promise.all([
      getBlogPostsAction(),
      getCategoriesAction("blog"),
    ]);
    setPosts(data);
    if (cats) setBlogCats(cats.filter((c) => c.isActive));
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the post "${title}"?`)) return;
    setDeletingId(id);
    const res = await deleteBlogPostAction(id);
    if (res.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Post "${title}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
    setDeletingId(null);
  };

  const categories = Array.from(
    new Set([
      ...blogCats.map((c) => c.name),
      ...posts.map((p) => p.category).filter(Boolean),
    ])
  );

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = posts.filter((p) => p.status === "Published").length;
  const draftCount = posts.filter((p) => p.status === "Draft").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
            Editorial & Journalism
          </span>
          <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
            Blog & Thought Leadership
          </h1>
          <p className="text-xs text-navy-400">
            Manage real estate news, investment insights, architectural spotlights, and market reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-navy-400" />
            View Public Blog
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
          >
            <Plus className="h-4 w-4 text-gold" />
            Create Article
          </Link>
        </div>
      </div>

      {/* Flash Alert */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-navy-400">Total Articles</p>
          <p className="text-2xl font-serif font-bold text-navy mt-1">{posts.length}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-emerald-600">Published Live</p>
          <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-amber-600">Drafts & Review</p>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-1">{draftCount}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-navy-400">Categories</p>
          <p className="text-2xl font-serif font-bold text-navy mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-3 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-navy-100 pl-9 pr-3 py-1.5 text-xs text-navy focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-navy-100 px-3 py-1.5 text-xs text-navy-700 focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-navy-100 px-3 py-1.5 text-xs text-navy-700 focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-navy-400">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-navy-200" />
            <h3 className="mt-3 text-sm font-bold text-navy">No articles found</h3>
            <p className="text-xs text-navy-400 mt-1">Try adjusting your filters or write a new post.</p>
            <Link
              href="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
            >
              <Plus className="h-3.5 w-3.5 text-gold" /> Create New Post
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-navy-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-navy-500">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-navy-100 border border-navy-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/image-01.webp";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-navy line-clamp-1">{post.title}</p>
                        <p className="text-[11px] text-navy-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="rounded-md bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold-800 border border-gold/20">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-navy-700">
                    {post.author}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-navy-400">
                    {post.readTime}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        post.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : post.status === "Draft"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-navy-400">
                    {formatAdminDate(post.publishedAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="View Public"
                        className="rounded-lg p-1.5 text-navy-400 hover:bg-slate-100 hover:text-navy transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        title="Edit Article"
                        className="rounded-lg p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        title="Delete Article"
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
