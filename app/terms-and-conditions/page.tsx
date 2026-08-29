import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using Corona Properties Limited's website and services. Understand your rights and responsibilities.",
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "August 29, 2026";

  return (
    <>
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or services."
        breadcrumb="Terms & Conditions"
        bgImage="/image-03.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury max-w-4xl">
          <p className="text-sm text-navy-400 mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-navy-400 leading-relaxed">
                By accessing or using the Corona Properties Limited website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                2. Services Description
              </h2>
              <p className="text-navy-400 leading-relaxed">
                Corona Properties Limited is a residential land developer based in Bangladesh. We offer premium residential plots, land development services, legal documentation assistance, and property management solutions. All properties are subject to availability and market conditions.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                3. User Obligations
              </h2>
              <p className="text-navy-400 leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-navy-400">
                <li>Provide accurate and complete information when filling out forms or making inquiries</li>
                <li>Use our website and services only for lawful purposes</li>
                <li>Not engage in any activity that disrupts or interferes with our website</li>
                <li>Respect the intellectual property rights of Corona Properties Limited</li>
                <li>Not reproduce, distribute, or exploit any content from our website without written permission</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-navy-400 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of Corona Properties Limited or its licensors and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use is prohibited.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-navy-400 leading-relaxed">
                Corona Properties Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. We do not guarantee the accuracy, completeness, or timeliness of information presented on our website.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                6. Third-Party Links
              </h2>
              <p className="text-navy-400 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                7. Governing Law
              </h2>
              <p className="text-navy-400 leading-relaxed">
                These Terms & Conditions shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-navy-400 leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting. Your continued use of our website following any changes indicates your acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                9. Contact Us
              </h2>
              <p className="text-navy-400 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-white rounded-xl border border-navy-50 shadow-card">
                <p className="font-semibold text-navy">{SITE_CONFIG.name}</p>
                <p className="text-navy-400 mt-1">{CONTACT_INFO.address}</p>
                <p className="text-navy-400 mt-1">
                  Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-gold-600 hover:underline">{CONTACT_INFO.email}</a>
                </p>
                <p className="text-navy-400 mt-1">
                  Phone: <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-gold-600 hover:underline">{CONTACT_INFO.phone}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
