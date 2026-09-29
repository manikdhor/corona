import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/lead/LeadForm";
import { getBlogPostsAction } from "@/lib/admin/actions";
import { BLOG_POSTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Expert insights, market trends, and investment guides on Bangladesh's residential land market from Corona Properties' specialists.",
};

export default async function BlogPage() {
  const dynamicPosts = await getBlogPostsAction();
  const published = dynamicPosts.filter((p) => p.status === "Published");
  const posts = published.length > 0 ? published : (BLOG_POSTS as any[]);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        title="Insights & Perspectives"
        subtitle="Expert analysis, market trends, and investment guides from our team of land specialists and legal experts."
        breadcrumb="Blog"
        bgImage="/image-11.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
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
                    {featured.publishedAt || (featured as any).date || "Recent"}
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
                          {typeof post.author === "object" ? post.author?.name : (post.author || "Corona Team")}
                        </p>
                        <p className="text-xs text-navy-400">
                          {post.publishedAt || (post as any).date}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Lead guidance section */}
          <section className="mt-24">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="eyebrow">Need Expert Guidance?</span>
                <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                  Turn Insights Into Action
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-navy-400">
                  Reading our articles is a great first step. If you&apos;re ready to explore properties or need personalized investment advice, our team is here to help.
                </p>
              </div>
              <div>
                <LeadForm
                  title="Get Expert Guidance"
                  subtitle="Whether you're buying your first plot or expanding your portfolio, we'll match you with the right opportunity."
                  source="Blog Page Guidance"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
