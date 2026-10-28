import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
  Camera,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data";
import { getBlogPostAction, getBlogPostsAction } from "@/lib/admin/actions";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/home/CTABanner";
import LeadForm from "@/components/lead/LeadForm";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogShareBar from "@/components/blog/BlogShareBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export async function generateStaticParams() {
  const dynamicPosts = await getBlogPostsAction();
  if (dynamicPosts && dynamicPosts.length > 0) {
    return dynamicPosts.map((p) => ({ slug: p.slug }));
  }
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = (await getBlogPostAction(params.slug)) || getBlogPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | Corona Properties Insights`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Corona Properties Blog`,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = (await getBlogPostAction(params.slug)) || getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPostsAction();
  const otherPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.status === "Published")
    .slice(0, 3);

  const authorName =
    typeof post.author === "object"
      ? (post.author as any)?.name
      : post.author || "Corona Research Team";
  const authorRole =
    typeof post.author === "object"
      ? (post.author as any)?.role
      : (post as any).authorRole || "Senior Market Analyst";

  return (
    <div className="bg-cream/40 min-h-screen">
      {/* Editorial Header Section */}
      <header className="pt-28 md:pt-36 pb-8 border-b border-navy-100/60 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-navy-400">
            <Link href="/" className="hover:text-gold transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-navy-200" />
            <Link href="/blog" className="hover:text-gold transition">
              Blog &amp; Insights
            </Link>
            <ChevronRight className="h-3 w-3 text-navy-200" />
            <span className="text-navy-600 font-medium truncate max-w-[200px] sm:max-w-none">
              {post.category}
            </span>
          </nav>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs mb-5">
            <Link
              href="/blog"
              className="rounded-full bg-gradient-gold/15 text-gold-900 border border-gold/30 px-3.5 py-1 font-bold uppercase tracking-wider hover:bg-gradient-gold/25 transition shadow-2xs"
            >
              {post.category}
            </Link>
            <span className="flex items-center gap-1.5 text-navy-500 font-medium">
              <Calendar className="h-3.5 w-3.5 text-gold-600" />
              {formatDate((post as any).publishedAt || (post as any).date)}
            </span>
            <span className="flex items-center gap-1.5 text-navy-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-gold-600" />
              {post.readTime}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-[1.18] tracking-tight text-balance">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p className="mt-4 text-lg sm:text-xl text-navy-500 font-normal leading-relaxed text-balance">
              {post.excerpt}
            </p>
          )}

          {/* Author Byline & Social Share Row */}
          <div className="mt-8 pt-6 border-t border-navy-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold shadow-xs text-navy font-bold text-sm">
                <User className="h-5 w-5 text-navy" />
              </div>
              <div>
                <p className="font-serif text-sm sm:text-base font-bold text-navy leading-tight">
                  {authorName}
                </p>
                <p className="text-xs text-navy-400 font-medium">{authorRole}</p>
              </div>
            </div>

            {/* Social Share Bar */}
            <BlogShareBar title={post.title} slug={post.slug} />
          </div>
        </div>
      </header>

      {/* Professional Featured Image Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-4">
        <div className="relative aspect-[16/9] md:aspect-[21/10] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-navy/15 border border-navy-100/90 bg-navy-100 group">
          <Image
            src={post.image || "/image-01.webp"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            sizes="(max-width: 1200px) 100vw, 1100px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-4 left-4 rounded-full bg-navy-950/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-cream flex items-center gap-2 border border-white/10 shadow-md">
            <Camera className="h-3.5 w-3.5 text-gold" />
            <span>Featured Image &bull; {post.category}</span>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-navy-400 px-2 gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Official Research Publication &bull; Corona Properties Limited
          </span>
          <span className="italic truncate max-w-sm">{post.title}</span>
        </div>
      </section>

      {/* Article Content */}
      <article className="pt-6 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <BlogArticleBody
            title={post.title}
            titleBn={(post as any).titleBn}
            excerpt={post.excerpt}
            excerptBn={(post as any).excerptBn}
            content={post.content}
            contentBn={(post as any).contentBn}
            author={authorName}
            authorRole={authorRole}
            featuredImage={post.image}
          />

          {/* Bottom Back Button */}
          <div className="mt-12 pt-8 border-t border-navy-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy transition-all hover:border-gold hover:text-gold-700 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to All Insights
            </Link>
            <BlogShareBar title={post.title} slug={post.slug} />
          </div>

          {/* In-Article Consultation CTA */}
          <div className="mt-14 rounded-3xl bg-gradient-navy p-8 sm:p-10 text-center text-cream shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
            <span className="rounded-full bg-gold/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              Corona Advisory
            </span>
            <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-cream">
              Ready to Explore Investment Opportunities?
            </h3>
            <p className="mt-3 text-cream/80 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Our land acquisition specialists and legal consultants are on hand to provide personalized due diligence and plot tours.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="gold" showArrow>
                Consult Our Specialists
              </Button>
              <Button href="/projects" variant="outline" className="border-cream/30 text-cream hover:bg-white/10">
                View Available Projects
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50 border-t border-navy-100">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Personalized Guidance</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Put This Knowledge to Work
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-500">
                Articles provide market context, but a real conversation unlocks the best investment opportunities. Share your requirements and let our experts match you with verified, high-growth plots in Purbachal and Dhaka.
              </p>
            </div>
            <div>
              <LeadForm
                title="Start Your Investment Journey"
                subtitle="Tell us about your goals and our senior consultants will recommend verified properties matching your budget."
                source={`Blog: ${post.title}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* More articles */}
      {otherPosts.length > 0 && (
        <section className="section-padding bg-white border-t border-navy-100">
          <div className="container-luxury">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                  Recommended Reading
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-navy">
                  More Insights from Corona
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-navy transition"
              >
                View All Articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {otherPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group card-luxury flex flex-col bg-cream/30"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <Image
                      src={p.image || "/image-01.webp"}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-navy/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-navy-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(p.publishedAt || (p as any).date)}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.readTime}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-navy leading-snug transition-colors group-hover:text-gold-600 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-xs text-navy-400 line-clamp-2 leading-relaxed">
                      {p.excerpt}
                    </p>
                    <span className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 transition-colors group-hover:text-navy">
                      Read Full Story
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </div>
  );
}
