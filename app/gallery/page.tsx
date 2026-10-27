import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import LeadForm from "@/components/lead/LeadForm";
import { getMediaAction, getCategoriesAction, getSiteContentAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Corona Properties' portfolio of premium residential land developments, aerial views, and community layouts across Bangladesh.",
};

export default async function GalleryPage() {
  const [media, galleryCategories, siteContent] = await Promise.all([
    getMediaAction(),
    getCategoriesAction("gallery"),
    getSiteContentAction(),
  ]);

  const gPage = (siteContent as any)?.galleryPage;

  return (
    <>
      <PageHero
        title={gPage?.heroTitle || "Project Gallery"}
        subtitle={
          gPage?.heroSubtitle ||
          "A visual journey through our finest land developments, aerial views, and community layouts across Bangladesh."
        }
        breadcrumb={gPage?.breadcrumb || "Gallery"}
        bgImage={gPage?.heroBgImage || "/image-04.webp"}
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <GalleryGrid items={media} categories={galleryCategories} />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">{gPage?.leadEyebrow || "Love What You See?"}</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                {gPage?.leadHeading || "Let's Build Your Dream Together"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {gPage?.leadDescription ||
                  "Explore our gallery and find the community that fits your lifestyle. Contact us to schedule a site visit or discuss your requirements."}
              </p>
            </div>
            <div>
              <LeadForm
                title={gPage?.formTitle || "Schedule a Site Visit"}
                subtitle={
                  gPage?.formSubtitle ||
                  "Share your preferred project and timeline, and we'll arrange a personalized tour for you."
                }
                source="Gallery Page Site Visit Form"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
