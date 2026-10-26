"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Eye,
  FileText,
  Calendar,
  Clock,
  User,
  Tag,
} from "lucide-react";
import {
  getBlogPostAction,
  saveBlogPostAction,
  getCategoriesAction,
} from "@/lib/admin/actions";
import type { AdminCategory } from "@/lib/admin/seed";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";

export default function BlogPostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const isNew = idParam === "new";

  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [excerpt, setExcerpt] = useState("");
  const [excerptBn, setExcerptBn] = useState("");
  const [content, setContent] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [category, setCategory] = useState("Market Insights");
  const [blogCategories, setBlogCategories] = useState<AdminCategory[]>([]);
  const [author, setAuthor] = useState("Corona Research Team");
  const [authorRole, setAuthorRole] = useState("Market Analyst");
  const [image, setImage] = useState("/image-01.webp");
  const [readTime, setReadTime] = useState("5 min read");
  const [status, setStatus] = useState<"Draft" | "Published" | "Archived">("Published");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");

  useEffect(() => {
    getCategoriesAction("blog").then((cats) => {
      if (cats) setBlogCategories(cats.filter((c) => c.isActive));
    });
    if (!isNew && idParam) {
      (async () => {
        setLoading(true);
        const post = await getBlogPostAction(idParam);
        if (post) {
          setId(post.id);
          setTitle(post.title || "");
          setTitleBn(post.titleBn || "");
          setSlug(post.slug || "");
          setAutoSlug(false);
          setExcerpt(post.excerpt || "");
          setExcerptBn(post.excerptBn || "");
          setContent(post.content || "");
          setContentBn(post.contentBn || "");
          setCategory(post.category || "Market Insights");
          setAuthor(post.author || "Corona Research Team");
          setAuthorRole(post.authorRole || "Market Analyst");
          setImage(post.image || "/image-01.webp");
          setReadTime(post.readTime || "5 min read");
          setStatus(post.status as any || "Published");
          setPublishedAt(post.publishedAt || new Date().toISOString().split("T")[0]);
        } else {
          setErrorMsg("Post not found.");
        }
        setLoading(false);
      })();
    }
  }, [idParam, isNew]);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")
      .slice(0, 80);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug && isNew) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    const postPayload = {
      id: isNew ? undefined : id,
      title: title.trim(),
      titleBn: titleBn.trim() || null,
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      excerptBn: excerptBn.trim() || null,
      content: content.trim(),
      contentBn: contentBn.trim() || null,
      category: category.trim(),
      author: author.trim(),
      authorRole: authorRole.trim(),
      image: image.trim(),
      readTime: readTime.trim(),
      status,
      publishedAt: publishedAt || null,
    };

    const res = await saveBlogPostAction(postPayload);
    setSaving(false);

    if (res.success && res.post) {
      setSuccessMsg("Article saved successfully!");
      if (isNew) {
        router.push(`/admin/blog/${res.post.id}`);
      } else {
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } else {
      setErrorMsg(res.error || "Failed to save article.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-navy-400">
        Loading post editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-xl border border-navy-200 bg-white p-2 text-navy-600 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              {isNew ? "New Publication" : "Edit Article"}
            </span>
            <h1 className="font-serif text-2xl font-bold text-navy mt-0.5">
              {title || (isNew ? "Untitled Article" : "Edit Post")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && slug && (
            <Link
              href={`/blog/${slug}`}
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
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
            {/* Language Switcher */}
            <div className="flex border-b border-navy-100 pb-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === "en" ? "bg-navy text-gold" : "text-navy-400 hover:text-navy"
                }`}
              >
                English (Default)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bn")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === "bn" ? "bg-navy text-gold" : "text-navy-400 hover:text-navy"
                }`}
              >
                Bangla (বাংলা)
              </button>
            </div>

            {activeTab === "en" ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                    Article Title (English) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Why Purbachal is Dhaka's Next Real Estate Investment Frontier"
                    className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-sm font-semibold text-navy focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                      URL Slug *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[11px] text-gold-700 hover:underline"
                    >
                      {autoSlug ? "Lock Auto-Slug" : "Auto-generate"}
                    </button>
                  </div>
                  <div className="flex items-center rounded-xl border border-navy-200 bg-slate-50/50 px-3 py-1.5 focus-within:border-gold focus-within:bg-white">
                    <span className="text-xs text-navy-400 select-none">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setSlug(e.target.value);
                      }}
                      placeholder="purbachal-real-estate-frontier"
                      className="w-full bg-transparent pl-1 text-xs font-mono text-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                    Short Excerpt / Meta Description *
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Provide a concise 1-2 sentence overview for search previews and blog index cards..."
                    className="w-full rounded-xl border border-navy-200 p-3 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                    Article Title (Bangla)
                  </label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: পূর্বাচল কেন ঢাকার পরবর্তী রিয়েল এস্টেট হটস্পট"
                    className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-sm font-semibold text-navy focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">
                    Short Excerpt (Bangla)
                  </label>
                  <textarea
                    rows={2}
                    value={excerptBn}
                    onChange={(e) => setExcerptBn(e.target.value)}
                    placeholder="সংক্ষিপ্ত বিবরণী যা বাংলা কার্ড ও সার্চ প্রিভিউতে প্রদর্শিত হবে..."
                    className="w-full rounded-xl border border-navy-200 p-3 text-xs text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* WYSIWYG Rich Text Editor */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                Article Body Content ({activeTab === "en" ? "English" : "Bangla"}) *
              </label>
              <span className="text-[11px] text-navy-400">
                Supports headings, images, YouTube embeds, quotes, and styling
              </span>
            </div>

            {activeTab === "en" ? (
              <RichTextEditor
                content={content}
                onChange={(html) => setContent(html)}
                placeholder="Write your in-depth article here..."
              />
            ) : (
              <RichTextEditor
                content={contentBn}
                onChange={(html) => setContentBn(html)}
                placeholder="বাংলা ভাষায় বিস্তারিত প্রতিবেদন লিখুন..."
              />
            )}
          </div>
        </div>

        {/* Right 1 Col: Metadata & Publishing Settings */}
        <div className="space-y-6">
          {/* Publication Status */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold-700" />
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="Published">Published (Live on Website)</option>
                <option value="Draft">Draft (Internal Review)</option>
                <option value="Archived">Archived (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Publish Date</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Read Time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Categorization & Author */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-gold-700" />
              Taxonomy & Byline
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-navy-600">Category</label>
                <Link
                  href="/admin/categories"
                  className="text-[10px] font-semibold text-gold-700 hover:underline"
                >
                  Manage Categories
                </Link>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Market Insights"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs font-semibold text-navy focus:border-gold focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5">
                  {(blogCategories.length > 0
                    ? blogCategories.map((c) => c.name)
                    : ["Investment Guide", "Market Trends", "Legal", "Market Insights", "Architecture"]
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold border transition ${
                        category === cat
                          ? "bg-navy text-gold border-navy"
                          : "bg-slate-50 text-navy-600 border-navy-100 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Corona Research Team"
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Author Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Senior Market Analyst"
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-gold-700" />
              Cover Image
            </h3>

            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/image-01.webp or external image URL"
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy focus:border-gold focus:outline-none"
              />
            </div>

            {/* Image Preview */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
              <img
                src={image}
                alt="Cover Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/image-01.webp";
                }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-navy-400 w-full mb-1">Quick Select Presets:</span>
              {[
                "/image-01.webp",
                "/image-02.webp",
                "/image-03.webp",
                "/image-04.webp",
                "/image-05.webp",
              ].map((imgUrl) => (
                <button
                  key={imgUrl}
                  type="button"
                  onClick={() => setImage(imgUrl)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition ${
                    image === imgUrl
                      ? "bg-gold/20 text-gold-900 border-gold"
                      : "bg-slate-50 text-navy-500 border-navy-100"
                  }`}
                >
                  {imgUrl.replace("/", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
