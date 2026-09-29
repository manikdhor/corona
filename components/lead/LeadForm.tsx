"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, User, Phone, Mail, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { submitLeadInquiryAction } from "@/lib/admin/actions";

interface LeadFormProps {
  title?: string;
  subtitle?: string;
  propertyName?: string;
  compact?: boolean;
  source?: string;
}

export default function LeadForm({
  title = "Send Us a Message",
  subtitle = "Fill out the form below and our team will get back to you within 24 hours.",
  propertyName,
  compact = false,
  source = "Website Form",
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: propertyName ? `I'm interested in ${propertyName}...` : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitLeadInquiryAction({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message,
        propertyTitle: propertyName,
        source: source || (propertyName ? `Property Page: ${propertyName}` : "Contact Form"),
      });

      if (res.success) {
        setSubmitted(true);
        setForm({
          name: "",
          phone: "",
          email: "",
          message: propertyName ? `I'm interested in ${propertyName}...` : "",
        });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setErrorMsg(res.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-navy-50 bg-white p-8 shadow-card md:p-10 ${compact ? 'p-6 md:p-8' : ''}`}>
      <h3 className="font-serif text-2xl font-bold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-navy-400">{subtitle}</p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex flex-col items-center justify-center rounded-xl bg-emerald-50 p-12 text-center"
          >
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <p className="mt-4 font-serif text-xl font-bold text-navy">Thank You!</p>
            <p className="mt-2 text-sm text-navy-400">
              Your inquiry has been received. Our team will contact you shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-2'}`}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-navy-100 bg-navy-50/30 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 1XXX XXXXXX"
                    className="w-full rounded-xl border border-navy-100 bg-navy-50/30 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-navy-100 bg-navy-50/30 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-navy-300" />
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                  className="w-full resize-none rounded-xl border border-navy-100 bg-navy-50/30 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy-300 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Inquiry...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Inquiry
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
