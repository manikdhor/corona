import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Understand Corona Properties Limited's booking, cancellation, and refund policies for land purchases and plot reservations.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "August 29, 2026";

  return (
    <>
      <PageHero
        title="Refund Policy"
        subtitle="Transparent policies for booking, cancellation, and refunds. Your trust is our priority."
        breadcrumb="Refund Policy"
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
                All cancellation requests must be submitted in writing to our office or via email to {CONTACT_INFO.email}.
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
