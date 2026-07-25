import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyFilter from "@/components/property/PropertyFilter";
import LeadForm from "@/components/lead/LeadForm";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse Corona Properties' premium residential plots for sale in Gulshan, Banani, Baridhara, Uttara, Dhanmondi, and Bashundhara, Dhaka.",
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero
        title="Premium Land Collection"
        subtitle="Discover Bangladesh's finest residential plots — each one RAJUK-approved, legally verified, and ready for your dream project."
        breadcrumb="Properties"
        bgImage="/image-03.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <PropertyFilter />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">Start Your Journey</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                Ready to Own Premium Residential Land?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                Browse our curated collection or let us match you with the perfect plot. Share your requirements and we'll shortlist the best options for you.
              </p>
            </div>
            <div>
              <LeadForm
                title="Request Property Recommendations"
                subtitle="Tell us your budget, preferred area, and requirements. We'll get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
