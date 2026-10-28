import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/lead/LeadForm";
import BlogCatalog from "@/components/blog/BlogCatalog";
import {
  getBlogPostsAction,
  getCategoriesAction,
  getSiteContentAction,
} from "@/lib/admin/actions";
import { BLOG_POSTS } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Expert insights, market trends, and investment guides on Bangladesh's residential land market from Corona Properties' specialists.",
};

export default async function BlogPage() {
  const [dynamicPosts, blogCategories, siteContent] = await Promise.all([
    getBlogPostsAction(),
    getCategoriesAction("blog"),
    getSiteContentAction(),
  ]);
  const posts =
    dynamicPosts.length > 0
      ? dynamicPosts.filter((p) => p.status === "Published")
      : (BLOG_POSTS as any[]);

  const bPage = (siteContent as any)?.blogPage;

  return (
    <>
      <PageHero
        title={bPage?.heroTitle || "Insights & Perspectives"}
        subtitle={
          bPage?.heroSubtitle ||
          "Expert analysis, market trends, and investment guides from our team of land specialists and legal experts."
        }
        breadcrumb={bPage?.breadcrumb || "Blog"}
        bgImage={bPage?.heroBgImage || "/image-11.webp"}
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <BlogCatalog posts={posts} categories={blogCategories} />

          {/* Lead guidance section */}
          <section className="mt-24">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="eyebrow">
                  {bPage?.leadEyebrow || "Need Expert Guidance?"}
                </span>
                <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                  {bPage?.leadHeading || "Turn Insights Into Action"}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-navy-400">
                  {bPage?.leadDescription ||
                    "Reading our articles is a great first step. If you're ready to explore properties or need personalized investment advice, our team is here to help."}
                </p>
              </div>
              <div>
                <LeadForm
                  title={bPage?.formTitle || "Get Expert Guidance"}
                  subtitle={
                    bPage?.formSubtitle ||
                    "Whether you're buying your first plot or expanding your portfolio, we'll match you with the right opportunity."
                  }
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
