import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { getPageAction, getSettingsAction } from "@/lib/admin/actions";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimers regarding property information, investment risks, and website content from Corona Properties Limited.",
};

export default async function DisclaimerPage() {
  const [page, settings] = await Promise.all([
    getPageAction("disclaimer"),
    getSettingsAction(),
  ]);
  const lastUpdated = page?.lastUpdated || "August 29, 2026";
  const title = page?.title || "Disclaimer";
  const company = settings?.company || {
    name: "Corona Properties Limited",
    address: "Mar garden, House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka 1212",
    email: "cplcoronapropertiesltd@gmail.com",
    phone: "+880 18 0575 9297",
  };

  return (
    <>
      <PageHero
        title={title}
        subtitle="Important information about our website content, property details, and investment considerations."
        breadcrumb={title}
        bgImage="/image-03.webp"
      />

      <section className="section-padding bg-cream">
        <div className="container-luxury max-w-4xl">
          <p className="text-sm text-navy-400 mb-8">
            Last updated: {lastUpdated}
          </p>

          {page?.content && page.content.includes("<") ? (
            <div
              className="prose prose-lg prose-navy max-w-none text-navy-600 leading-relaxed [&>p]:mb-4 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-navy [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-navy [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  1. General Disclaimer
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  The information provided on the Corona Properties Limited website is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  2. Property Information
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  All property descriptions, dimensions, specifications, amenities, and pricing information are subject to change without notice. Actual properties may vary from descriptions or images shown on this website. We recommend that you conduct independent verification and due diligence before making any investment decisions.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  3. Investment Risks
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Real estate investments carry inherent risks, including market fluctuations, regulatory changes, and unforeseen circumstances. Past performance is not indicative of future results. Any projections, estimates, or forward-looking statements are subject to risks and uncertainties. We do not guarantee any specific returns or appreciation rates.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  4. Third-Party Content
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Our website may contain content from third parties, including but not limited to embedded maps, social media feeds, and external links. We do not endorse, warrant, or assume responsibility for the accuracy or reliability of any third-party content.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  5. No Professional Advice
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  The content on this website does not constitute legal, financial, tax, or professional advice. You should consult with qualified professionals before making any property investment or legal decisions. Always seek independent advice tailored to your specific circumstances.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  6. Limitation of Liability
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  In no event shall Corona Properties Limited, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of our website or services.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  7. Indemnification
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  You agree to indemnify and hold harmless Corona Properties Limited from any claims, damages, losses, liabilities, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with your use of our website or violation of these terms.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  8. Contact Us
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  If you have any questions about this Disclaimer, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-white rounded-xl border border-navy-50 shadow-card">
                  <p className="font-semibold text-navy">{company.name}</p>
                  <p className="text-navy-400 mt-1">{company.address}</p>
                  <p className="text-navy-400 mt-1">
                    Email:{" "}
                    <a href={`mailto:${company.email}`} className="text-gold-600 hover:underline">
                      {company.email}
                    </a>
                  </p>
                  <p className="text-navy-400 mt-1">
                    Phone:{" "}
                    <a href={`tel:${company.phone.replace(/[^0-9+]/g, "")}`} className="text-gold-600 hover:underline">
                      {company.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
