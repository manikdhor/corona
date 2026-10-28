import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectCard from "@/components/home/ProjectCard";
import { PROJECTS, mapAdminPropertyToProject } from "@/lib/projects";
import LeadForm from "@/components/lead/LeadForm";
import { getPropertiesAction, getSiteContentAction } from "@/lib/admin/actions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Corona Properties' signature residential developments — master-planned communities with world-class amenities in Dhaka's most prestigious locations.",
};

export default async function ProjectsPage() {
  const [adminProps, siteContent] = await Promise.all([
    getPropertiesAction(),
    getSiteContentAction(),
  ]);

  const pContent = (siteContent as any)?.projectsPage;

  const projectList =
    adminProps.length > 0
      ? adminProps.map((p) => {
          const baseProj = PROJECTS.find((bp) => bp.slug === p.slug || bp.id === p.id);
          return mapAdminPropertyToProject(p, baseProj);
        })
      : PROJECTS;

  return (
    <>
      <PageHero
        title={pContent?.heroTitle || pContent?.title || "Our Projects"}
        subtitle={
          pContent?.heroSubtitle ||
          pContent?.subtitle ||
          "A curated portfolio of premium residential land developments — each crafted as a landmark community."
        }
        breadcrumb={pContent?.breadcrumb || "Projects"}
        bgImage={pContent?.heroBgImage || pContent?.bgImage || "/image-04.webp"}
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projectList.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {projectList.length > 0 && (
        <section className="section-padding bg-navy-50/50">
          <div className="container-luxury">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="eyebrow">{pContent?.consultationEyebrow || "Can't Decide?"}</span>
                <h2 className="mt-5 font-serif text-display-md font-bold text-navy text-balance">
                  {pContent?.consultationHeading || "Let Us Guide You"}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-navy-400">
                  {pContent?.consultationDescription ||
                    "Whether you're looking for a plot in an established community or a new launch with high growth potential, our specialists will match you with the perfect opportunity."}
                </p>
              </div>
              <div>
                <LeadForm
                  title={pContent?.formTitle || "Request Project Consultation"}
                  subtitle={
                    pContent?.formSubtitle ||
                    "Share your requirements and we'll shortlist the best projects for you."
                  }
                  source="Projects Page Consultation Form"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
