import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { TEAM } from "@/lib/data";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Management Messages",
  description:
    "Read messages from the leadership of Corona Properties Limited — Chairman, Managing Director, and Director share their vision for Maple Leaf Garden City.",
};

function MemberBio({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter((p) => p.trim());
  return (
    <>
      {paragraphs.map((p, idx) => (
        <p
          key={idx}
          className="text-lg md:text-xl lg:text-[1.35rem] leading-relaxed md:leading-relaxed text-navy/90 font-light"
        >
          {p}
        </p>
      ))}
    </>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="Management Messages"
        subtitle="The vision, values, and commitment behind Corona Properties and Maple Leaf Garden City."
        breadcrumb="Management Messages"
        bgImage="/image-11.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Our Leadership"
            title="Words From the Top"
            subtitle="Transparency, integrity, and a commitment to building communities — hear directly from the leaders driving our mission."
          />

          <div className="mt-24 md:mt-32 space-y-24 md:space-y-36">
            {TEAM.map((member, i) => (
              <Reveal key={member.id} y={50}>
                <div
                  className={`flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24 items-start ${
                    i % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Image — gold framed, always top-aligned */}
                  <div className="w-full lg:w-5/12 shrink-0">
                    <div className="relative">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-top"
                          sizes="(max-width: 1024px) 100vw, 38vw"
                        />
                      </div>
                      <div className="absolute -inset-3 border border-gold/50 rounded-sm pointer-events-none" />
                    </div>
                  </div>

                  {/* Message — constrained width for readability */}
                  <div className="w-full lg:w-7/12 flex flex-col justify-start">
                    <div className="max-w-2xl">
                      <MemberBio text={member.bio} />
                    </div>

                    <div className="mt-10 md:mt-14 flex items-center gap-5">
                      <div className="h-px w-12 bg-gradient-to-r from-gold to-transparent" />
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-navy">
                          {member.name}
                        </h3>
                        <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider between members */}
                {i < TEAM.length - 1 && (
                  <div className="mt-24 md:mt-36 flex justify-center">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding bg-gradient-navy text-cream relative overflow-hidden">
        <div className="absolute inset-0 texture-noise" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="container-luxury relative text-center">
          <p className="eyebrow justify-center text-gold mb-6">Join Our Community</p>
          <h2 className="font-serif text-display-md font-bold text-cream text-balance">
            Ready to Build Your Legacy?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-cream/75 text-lg leading-relaxed">
            Discover Maple Leaf Garden City — where Canadian living meets Bangladeshi warmth, and every plot is a promise of quality.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn-gold">
              Book a Visit
            </a>
            <a href="/projects" className="btn-outline-light">
              View Projects
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
