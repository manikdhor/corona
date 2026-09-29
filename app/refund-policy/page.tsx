import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { getPageAction } from "@/lib/admin/actions";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Understand Corona Properties Limited's booking, cancellation, and refund policies for land purchases and plot reservations.",
};

export default async function RefundPolicyPage() {
  const page = await getPageAction("refund-policy");
  const lastUpdated = page?.lastUpdated || "August 29, 2026";
  const title = page?.title || "Refund Policy";

  return (
    <>
      <PageHero
        title={title}
        subtitle="Transparent policies for booking, cancellation, and refunds. Your trust is our priority."
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
                  1. Overview
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Corona Properties Limited is committed to transparency in all our transactions. This Refund Policy outlines the terms and conditions governing booking cancellations, refund requests, and related procedures for our residential plot projects.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  2. Booking and Advance Payment
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  To secure a plot, customers are required to pay a booking advance. This advance confirms your reservation and initiates the documentation process. All payments must be made through the official channels specified by Corona Properties Limited.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  3. Cancellation by Customer
                </h2>
                <p className="text-navy-400 leading-relaxed mb-4">
                  If you wish to cancel your booking, the following refund structure applies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy-400">
                  <li>Cancellation within 7 days of booking: Full refund of the advance amount minus administrative charges of 5%</li>
                  <li>Cancellation between 8 and 30 days: 75% refund of the advance amount</li>
                  <li>Cancellation after 30 days: No refund of the advance amount</li>
                </ul>
                <p className="text-navy-400 leading-relaxed mt-4">
                  All cancellation requests must be submitted in writing to our office or via email to cplcoronapropertiesltd@gmail.com.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  4. Cancellation by Corona Properties
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  In the unlikely event that we are unable to deliver the booked plot due to circumstances beyond our control, we will provide a full refund of all payments made, plus interest at the rate of 6% per annum calculated from the date of payment to the date of refund.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  5. Refund Processing
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  Approved refunds will be processed within 30 business days of the cancellation request being accepted. Refunds will be issued via the same payment method used for the original transaction, unless otherwise agreed in writing.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  6. Non-Refundable Items
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  The following are non-refundable: processing fees, documentation charges, legal verification fees, and any third-party service costs already incurred on your behalf.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  7. Payment Plans and Installments
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  For customers on installment plans, failure to make payments as per the agreed schedule may result in cancellation of the booking without refund. A grace period of 15 days will be provided for each installment. Late payments may attract a penalty of 2% per month on the overdue amount.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  8. Modifications
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  We reserve the right to modify this Refund Policy at any time. Any changes will be communicated to customers and posted on our website. Continued use of our services after changes constitutes acceptance of the revised policy.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                  9. Contact Us
                </h2>
                <p className="text-navy-400 leading-relaxed">
                  For questions about cancellations or refunds, please contact us at:
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
