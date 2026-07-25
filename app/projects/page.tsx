import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/home/ProjectCard";
import { CONTACT_INFO, SITE_CONFIG } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import LeadForm from "@/components/lead/LeadForm";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Corona Properties' signature residential developments — master-planned communities with world-class amenities in Dhaka's most prestigious locations.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="A curated portfolio of premium residential land developments — each crafted as a landmark community."
        breadcrumb="Projects"
        bgImage="/image-04.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {PROJECTS.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="eyebrow">Can't Decide?</span>
                <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                  Let Us Guide You
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-navy-400">
                  Whether you're looking for a plot in an established community or a new launch with high growth potential, our specialists will match you with the perfect opportunity.
                </p>
              </div>
              <div>
                <LeadForm
                  title="Request Project Consultation"
                  subtitle="Share your requirements and we'll shortlist the best projects for you."
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
