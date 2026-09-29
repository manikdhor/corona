import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { getPageAction } from "@/lib/admin/actions";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Corona Properties Limited collects, uses, and protects your personal information. Our commitment to your privacy.",
};

export default async function PrivacyPolicyPage() {
  const page = await getPageAction("privacy-policy");
  const lastUpdated = page?.lastUpdated || "August 29, 2026";
  const title = page?.title || "Privacy Policy";

  return (
    <>
      <PageHero
        title={title}
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your personal information."
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
                  1. Introduction
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Corona Properties Limited (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  2. Information We Collect
                </h2>
                <p className="text-navy-400 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy-400">
                  <li>Fill out a contact form or inquiry form</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Request property information or brochures</li>
                  <li>Schedule a site visit</li>
                  <li>Communicate with us via phone, email, or messaging</li>
                </ul>
                <p className="text-navy-400 leading-relaxed mt-4">
                  This information may include your name, email address, phone number, address, investment preferences, and any other details you choose to provide.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-navy-400 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy-400">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you property updates, market insights, and promotional materials</li>
                  <li>Process transactions and manage your account</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  4. Information Sharing
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, conducting transactions, or servicing you, provided they agree to keep your information confidential.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  5. Data Security
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  6. Cookies and Tracking
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze traffic and improve our site. You can choose to disable cookies through your browser settings, though some features may not function properly.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  7. Your Rights
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us using the information provided below.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  8. Changes to This Policy
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  9. Contact Us
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  If you have questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-white rounded-xl border border-navy-50 shadow-card">
                  <p className="font-semibold text-navy">Corona Properties Limited</p>
                  <p className="text-navy-400 mt-1">
                    Mar garden, House # 145, Flat # 704, Road # 3, Block A, Niketon, Gulshan 01, Dhaka 1212
                  </p>
                  <p className="text-navy-400 mt-1">
                    Email:{" "}
                    <a href="mailto:cplcoronapropertiesltd@gmail.com" className="text-gold-600 hover:underline">
                      cplcoronapropertiesltd@gmail.com
                    </a>
                  </p>
                  <p className="text-navy-400 mt-1">
                    Phone:{" "}
                    <a href="tel:+8801805759297" className="text-gold-600 hover:underline">
                      +880 18 0575 9297
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
