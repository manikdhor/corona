import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/lead/LeadForm";
import FAQ from "@/components/contact/FAQ";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Corona Properties Limited. Visit our Gulshan office, call us, or send a message. We respond within 24 hours.",
};

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Visit Our Office",
    lines: [CONTACT_INFO.address],
    action: { label: "Get Directions", href: "https://maps.google.com/?q=Mar+garden,+House+%23145,+Flat+%23704,+Road+%233,+Block+A,+Niketon,+Gulshan+01,+Dhaka+1212" },
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: [CONTACT_INFO.phone, "Sat – Thu: 9 AM – 6 PM"],
    action: { label: "Call Now", href: `tel:${CONTACT_INFO.phoneRaw}` },
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [CONTACT_INFO.email, "We reply within 24 hours"],
    action: { label: "Send Email", href: `mailto:${CONTACT_INFO.email}` },
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Have questions about our properties or services? We're here to help you make confident, informed decisions about your land investment."
        breadcrumb="Contact"
        bgImage="/image-07.webp"
      />

      {/* Contact cards */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-6 md:grid-cols-3 -mt-32 relative z-10">
            {CONTACT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-navy-50 bg-white p-8 text-center shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy">{card.title}</h3>
                  {card.lines.map((line, j) => (
                    <p key={j} className="mt-2 text-sm text-navy-400 leading-relaxed">{line}</p>
                  ))}
                  <a
                    href={card.action.href}
                    target={card.action.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-navy"
                  >
                    {card.action.label}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Form + Info */}
          <div className="mt-20 grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <LeadForm
                title="Send Us a Message"
                subtitle="Fill out the form below and our team will get back to you within 24 hours."
              />
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Office hours */}
              <div className="rounded-2xl bg-gradient-navy p-8 text-cream shadow-navy">
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="h-6 w-6 text-gold" />
                  <h3 className="font-serif text-xl font-bold text-cream">Office Hours</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-cream/70">Saturday – Thursday</span>
                    <span className="font-semibold text-gold">9:00 AM – 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-cream/70">Friday</span>
                    <span className="font-semibold text-cream/50">Closed</span>
                  </li>
                </ul>
                <p className="mt-5 text-xs text-cream/50">
                  * Site visits available by appointment on weekends and holidays.
                </p>
              </div>

              {/* WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition-all hover:bg-emerald-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-bold text-navy">Chat on WhatsApp</p>
                    <p className="text-sm text-navy-400">Quick responses, instant support</p>
                  </div>
                </div>
              </a>

              {/* Social */}
              <div className="rounded-2xl border border-navy-50 bg-white p-8 shadow-card">
                <h3 className="font-serif text-lg font-bold text-navy mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                    { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
                    { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy transition-all duration-300 hover:border-gold hover:bg-gradient-gold hover:text-navy"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-navy-950">
        <div className="container-luxury py-16">
          <SectionHeading
            eyebrow="Find Us"
            title="Our Location"
            subtitle="Visit our office in the heart of Gulshan, Dhaka."
            light
          />
        </div>
        <div className="h-[450px] w-full">
          <iframe
            title="Corona Properties Ltd"
            src="https://www.google.com/maps?q=Mar+garden,+House+%23145,+Flat+%23704,+Road+%233,+Block+A,+Niketon,+Gulshan+01,+Dhaka+1212&z=16&output=embed"
            className="h-full w-full border-0 grayscale-[0.3]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently Asked Questions"
            subtitle="Quick answers to the questions we hear most often from our clients."
          />
          <div className="mt-14">
            <FAQ />
          </div>
        </div>
      </section>
    </>
  );
}
