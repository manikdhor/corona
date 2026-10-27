import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PropertyFilter from "@/components/property/PropertyFilter";
import LeadForm from "@/components/lead/LeadForm";
import { getPropertiesAction, getSiteContentAction, getCategoriesAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse Corona Properties' premium residential plots for sale in Gulshan, Banani, Baridhara, Uttara, Dhanmondi, and Bashundhara, Dhaka.",
};

export default async function PropertiesPage() {
  const [properties, siteContent, typeCategories, areaCategories] = await Promise.all([
    getPropertiesAction(),
    getSiteContentAction(),
    getCategoriesAction("property_type"),
    getCategoriesAction("property_area"),
  ]);

  const pContent = (siteContent as any)?.propertiesPage;

  return (
    <>
      <PageHero
        title={pContent?.heroTitle || pContent?.title || "Premium Land Collection"}
        subtitle={
          pContent?.heroSubtitle ||
          pContent?.subtitle ||
          "Discover Bangladesh's finest residential plots — each one with full documentation and ready for your dream project."
        }
        breadcrumb={pContent?.breadcrumb || "Properties"}
        bgImage={pContent?.heroBgImage || pContent?.bgImage || "/image-03.webp"}
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <PropertyFilter
            initialProperties={properties}
            typeCategories={typeCategories}
            areaCategories={areaCategories}
          />
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="eyebrow">{pContent?.leadEyebrow || "Start Your Journey"}</span>
              <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                {pContent?.leadHeading || "Ready to Own Premium Residential Land?"}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-400">
                {pContent?.leadDescription ||
                  "Browse our curated collection or let us match you with the perfect plot. Share your requirements and we'll shortlist the best options for you."}
              </p>
            </div>
            <div>
              <LeadForm
                title={pContent?.formTitle || "Request Property Recommendations"}
                subtitle={
                  pContent?.formSubtitle ||
                  "Tell us your budget, preferred area, and requirements. We'll get back to you within 24 hours."
                }
                source="Properties Page Recommendations Form"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
