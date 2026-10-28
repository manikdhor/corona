"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/lib/admin/seed";

interface BlogCatalogProps {
  posts: any[];
  categories?: AdminCategory[];
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function BlogCatalog({ posts, categories }: BlogCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categoryTabs = useMemo(() => {
    const activeCats = (categories || []).filter((c) => c.isActive).map((c) => c.name);
    const distinctFromPosts = Array.from(
      new Set(posts.map((p) => p.category).filter(Boolean))
    );
    return ["All", ...Array.from(new Set([...activeCats, ...distinctFromPosts]))];
  }, [categories, posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        post.category?.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, search]);

  const [featured, ...rest] = filteredPosts;

  return (
    <div>
      {/* Filter & Search Bar */}
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                selectedCategory === cat
                  ? "bg-gradient-gold text-navy shadow-gold"
                  : "bg-white text-navy hover:bg-navy-50 shadow-card"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-full border border-navy-100 bg-white py-2.5 pl-10 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white py-16 text-center">
          <h3 className="font-serif text-xl font-bold text-navy">No Articles Found</h3>
          <p className="mt-2 text-sm text-navy-400">
            Try selecting a different category or adjusting your search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
            className="mt-5 btn-gold"
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 lg:grid-cols-2 lg:gap-12 mb-20 rounded-2xl overflow-hidden shadow-card bg-white"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <Image
                  src={featured.image || "/image-01.webp"}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <span className="absolute top-4 left-4 rounded-full bg-gradient-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 lg:pr-12">
                <div className="flex items-center gap-4 text-xs text-navy-400 mb-4">
                  <span className="rounded-full bg-navy-50 px-3 py-1 font-semibold uppercase tracking-wider text-gold-700">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(featured.publishedAt || (featured as any).date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy leading-tight transition-colors group-hover:text-gold-600">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-relaxed text-navy-400">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors group-hover:text-navy">
                  Read Article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group card-luxury flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image || "/image-01.webp"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-navy-400 mb-3">
                      <span className="rounded-full bg-navy-50 px-3 py-1 font-semibold uppercase tracking-wider text-gold-700">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-navy leading-snug transition-colors group-hover:text-gold-600">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-400 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-navy">
                          {typeof post.author === "object"
                            ? post.author?.name
                            : post.author || "Corona Team"}
                        </p>
                        <p className="text-xs text-navy-400">
                          {formatDate(post.publishedAt || (post as any).date)}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
