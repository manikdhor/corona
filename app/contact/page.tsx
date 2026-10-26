import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/lead/LeadForm";
import FAQ from "@/components/contact/FAQ";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import PinterestIcon from "@/components/ui/PinterestIcon";
import {
  getFaqsAction,
  getSettingsAction,
  getSocialLinksAction,
  getCategoriesAction,
  getSiteContentAction,
} from "@/lib/admin/actions";

const PLATFORM_ICONS: Record<string, any> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  Twitter,
  Pinterest: PinterestIcon,
  YouTube: Youtube,
};

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Corona Properties Limited. Visit our Gulshan office, call us, or send a message. We respond within 24 hours.",
};

export default async function ContactPage() {
  const [faqs, settings, socialLinks, faqCategories, siteContent] = await Promise.all([
    getFaqsAction(),
    getSettingsAction(),
    getSocialLinksAction(),
    getCategoriesAction("faq"),
    getSiteContentAction(),
  ]);

  const cPage = (siteContent as any)?.contactPage;
  const activeSocials = socialLinks.filter((s) => s.isActive);
  const socials =
    activeSocials.length > 0
      ? activeSocials
      : [
          { platform: "Facebook", url: SOCIAL_LINKS.facebook },
          { platform: "Instagram", url: SOCIAL_LINKS.instagram },
          { platform: "LinkedIn", url: SOCIAL_LINKS.linkedin },
          { platform: "Twitter", url: SOCIAL_LINKS.twitter },
          { platform: "Pinterest", url: SOCIAL_LINKS.pinterest },
          { platform: "YouTube", url: SOCIAL_LINKS.youtube },
        ];

  const company = settings?.company;
  const address = company?.address || CONTACT_INFO.address;
  const phone = company?.phone || CONTACT_INFO.phone;
  const phoneRaw = (company?.whatsapp || phone).replace(/[^0-9+]/g, "");
  const email = company?.email || CONTACT_INFO.email;
  const hours = company?.hours || CONTACT_INFO.hours;
  const directionsUrl =
    company?.directionsUrl ||
    "https://maps.google.com/?q=Mar+garden,+House+%23145,+Flat+%23704,+Road+%233,+Block+A,+Niketon,+Gulshan+01,+Dhaka+1212";
  const mapEmbedUrl =
    company?.mapEmbedUrl ||
    "https://www.google.com/maps?q=Mar+garden,+House+%23145,+Flat+%23704,+Road+%233,+Block+A,+Niketon,+Gulshan+01,+Dhaka+1212&z=16&output=embed";

  const contactCards = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      lines: [address],
      action: {
        label: "Get Directions",
        href: directionsUrl,
      },
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: [phone, hours],
      action: { label: "Call Now", href: `tel:${phone.replace(/[^0-9+]/g, "")}` },
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: [email, "We reply within 24 hours"],
      action: { label: "Send Email", href: `mailto:${email}` },
    },
  ];

  return (
    <>
      <PageHero
        title={cPage?.heroTitle || "Get in Touch"}
        subtitle={
          cPage?.heroSubtitle ||
          "Have questions about our properties or services? We're here to help you make confident, informed decisions about your land investment."
        }
        breadcrumb={cPage?.breadcrumb || "Contact"}
        bgImage={cPage?.heroBgImage || "/image-07.webp"}
      />

      {/* Contact cards */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid gap-6 md:grid-cols-3 -mt-32 relative z-10">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-navy-50 bg-white p-8 text-center shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy">
                    {card.title}
                  </h3>
                  {card.lines.map((line, j) => (
                    <p key={j} className="mt-2 text-sm text-navy-400 leading-relaxed">
                      {line}
                    </p>
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
            <div className="lg:col-span-3">
              <LeadForm
                title={cPage?.formTitle || "Send Us a Message"}
                subtitle={
                  cPage?.formSubtitle ||
                  "Fill out the form below and our team will get back to you within 24 hours."
                }
                source="Contact Page Form"
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Office hours */}
              <div className="rounded-2xl bg-gradient-navy p-8 text-cream shadow-navy">
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="h-6 w-6 text-gold" />
                  <h3 className="font-serif text-xl font-bold text-cream">Office Hours</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-cream/70">Working Hours</span>
                    <span className="font-semibold text-gold">{hours}</span>
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

              {/* WhatsApp chat */}
              <a
                href={`https://wa.me/${phoneRaw}`}
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

              {/* Social links */}
              <div className="rounded-2xl border border-navy-50 bg-white p-8 shadow-card">
                <h3 className="font-serif text-lg font-bold text-navy mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socials.map((item: any) => {
                    const Icon = PLATFORM_ICONS[item.platform] || Facebook;
                    return (
                      <a
                        key={item.id || item.platform}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label || item.platform}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy transition-all duration-300 hover:border-gold hover:bg-gradient-gold hover:text-navy"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
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
            eyebrow={cPage?.mapEyebrow || "Find Us"}
            title={cPage?.mapHeading || "Our Location"}
            subtitle={cPage?.mapSubtitle || "Visit our office in the heart of Gulshan, Dhaka."}
            light
          />
        </div>
        <div className="h-[450px] w-full">
          <iframe
            title="Corona Properties Ltd"
            src={mapEmbedUrl}
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
            eyebrow={cPage?.faqEyebrow || "Common Questions"}
            title={cPage?.faqHeading || "Frequently Asked Questions"}
            subtitle={
              cPage?.faqSubtitle ||
              "Quick answers to the questions we hear most often from our clients."
            }
          />
          <div className="mt-14">
            <FAQ items={faqs} categories={faqCategories} />
          </div>
        </div>
      </section>
    </>
  );
}
