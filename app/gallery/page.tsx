import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import LeadForm from "@/components/lead/LeadForm";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Corona Properties' portfolio of premium residential land developments, aerial views, and community layouts across Bangladesh.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Project Gallery"
        subtitle="A visual journey through our finest land developments, aerial views, and community layouts across Bangladesh."
        breadcrumb="Gallery"
        bgImage="/image-04.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <GalleryGrid />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Love What You See?</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Let's Build Your Dream Together
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                Explore our gallery and find the community that fits your lifestyle. Contact us to schedule a site visit or discuss your requirements.
              </p>
            </div>
            <div>
              <LeadForm
                title="Schedule a Site Visit"
                subtitle="Share your preferred project and timeline, and we'll arrange a personalized tour for you."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
