import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, ArrowRight, User } from "lucide-react";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data";
import { getBlogPostAction, getBlogPostsAction } from "@/lib/admin/actions";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/home/CTABanner";
import LeadForm from "@/components/lead/LeadForm";
import BlogArticleBody from "@/components/blog/BlogArticleBody";

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
    title: post.title,
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
    .slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[60vh] min-h-[440px] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.image || "/image-01.webp"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-navy opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        </div>
        <div className="container-luxury relative z-10 pb-12">
          <Link
            href="/blog"
            className="group mb-6 inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-gold mb-4">
            <Link
              href="/blog"
              className="rounded-full bg-gold/20 px-3 py-1 text-gold hover:bg-gold/30 transition font-semibold"
            >
              {post.category}
            </Link>
            <span className="flex items-center gap-1.5 text-cream/70">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate((post as any).publishedAt || (post as any).date)}
            </span>
            <span className="flex items-center gap-1.5 text-cream/70">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-serif text-display-sm font-bold text-cream max-w-4xl leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="section-padding bg-cream">
        <div className="container-narrow">
          <BlogArticleBody
            title={post.title}
            titleBn={(post as any).titleBn}
            excerpt={post.excerpt}
            excerptBn={(post as any).excerptBn}
            content={post.content}
            contentBn={(post as any).contentBn}
            author={
              typeof post.author === "object"
                ? (post.author as any)?.name
                : post.author || "Corona Research Team"
            }
            authorRole={
              typeof post.author === "object"
                ? (post.author as any)?.role
                : (post as any).authorRole || "Senior Market Analyst"
            }
          />

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-navy p-8 text-center text-cream shadow-navy">
            <h3 className="font-serif text-2xl font-bold text-cream">
              Ready to Invest in Premium Land?
            </h3>
            <p className="mt-2 text-cream/70">
              Our experts are ready to guide you through every step.
            </p>
            <Button href="/contact" variant="gold" showArrow className="mt-6">
              Talk to a Specialist
            </Button>
          </div>
        </div>
      </article>

      {/* Lead Capture Section */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Ready to Invest?</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Put This Knowledge to Work
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                Articles are great, but a real conversation is better. Share your requirements and let our experts find the perfect land opportunity for you.
              </p>
            </div>
            <div>
              <LeadForm
                title="Start Your Investment Journey"
                subtitle="Tell us about your goals and we'll recommend the best properties that match your criteria."
              />
            </div>
          </div>
        </div>
      </section>

      {/* More articles */}
      {otherPosts.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <h2 className="mb-10 text-center font-serif text-display-sm font-bold text-navy">
              More Insights
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {otherPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group grid gap-6 sm:grid-cols-2 rounded-2xl overflow-hidden bg-white shadow-card"
                >
                  <div className="relative aspect-square sm:aspect-auto overflow-hidden">
                    <Image
                      src={p.image || "/image-01.webp"}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="50vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6">
                    <span className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2">
                      {p.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-navy leading-snug transition-colors group-hover:text-gold-600">
                      {p.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-600">
                      Read More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
