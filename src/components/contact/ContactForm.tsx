"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, X, CheckCircle } from "lucide-react";
import { useEnquiry } from "@/context/EnquiryContext";
import Select from "@/components/ui/Select";
import { categories, getById } from "@/lib/products";
import { buildContactText } from "@/lib/enquiry";
import { site } from "@/lib/site.config";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  qty: string;
  message: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  interest: "",
  qty: "",
  message: "",
};

type Status = "idle" | "sending" | "sent" | "handoff";

const inputCls = cn(
  "w-full rounded-xl bg-raised border border-line px-4 py-3 text-sm text-text placeholder-muted/50",
  "focus:outline-none focus:border-brass transition-colors"
);

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const { ids, remove, clear } = useEnquiry();

  const selectedProducts = ids.map(getById).filter(Boolean) as NonNullable<ReturnType<typeof getById>>[];

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.message.trim()) e.message = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const setValue = (k: keyof FormState) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const openWhatsApp = () => {
    if (!validate()) return;
    const text = encodeURIComponent(buildContactText(form, selectedProducts));
    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, "_blank", "noopener,noreferrer");
    setStatus("handoff");
  };

  const submit = async () => {
    if (!validate()) return;
    setSendError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productIds: ids, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      clear();
      setStatus("sent");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  };

  if (status === "sent" || status === "handoff") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-line bg-raised p-12 text-center"
      >
        <CheckCircle size={40} className="text-success" />
        <h3 className="font-display text-2xl font-semibold text-text">
          {status === "sent" ? "Enquiry sent" : "Opening WhatsApp…"}
        </h3>
        <p className="text-muted max-w-sm">
          {status === "sent"
            ? `Thank you, ${form.name.split(" ")[0] || "there"}. Your enquiry has reached our sales team — we'll reply to ${form.email} shortly.`
            : "Your message has been pre-filled. Complete the send in WhatsApp."}
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm(INITIAL); }}
          className="text-sm text-brass hover:underline mt-2"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form
      className="relative flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name *" error={errors.name}>
          <input className={cn(inputCls, errors.name && "border-danger")} placeholder="Your name" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" className={cn(inputCls, errors.email && "border-danger")} placeholder="you@company.com" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Phone *" error={errors.phone}>
          <input type="tel" className={cn(inputCls, errors.phone && "border-danger")} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Company">
          <input className={inputCls} placeholder="Your company (optional)" value={form.company} onChange={set("company")} />
        </Field>
        <Field label="Product Interest" htmlFor="interest">
          <Select
            id="interest"
            options={categories}
            value={form.interest}
            onChange={setValue("interest")}
            placeholder="Select category (optional)"
            clearable
          />
        </Field>
        <Field label="Quantity / MOQ">
          <input className={inputCls} placeholder="Approx. quantity needed" value={form.qty} onChange={set("qty")} />
        </Field>
      </div>

      <Field label="Message *" error={errors.message}>
        <textarea
          rows={4}
          className={cn(inputCls, "resize-none", errors.message && "border-danger")}
          placeholder="Tell us about your project…"
          value={form.message}
          onChange={set("message")}
        />
      </Field>

      {/* Selected products chips */}
      {selectedProducts.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">
            {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected from catalog
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs text-brass">
                {p.modelNo}
                <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Honeypot — off-screen for people, irresistible to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <AnimatePresence>
        {sendError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-xs text-danger"
          >
            {sendError} You can also reach us on WhatsApp or at{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 sm:flex-row mt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-brass-sheen py-3.5 text-sm font-semibold text-bg shadow-brass-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={16} /> Send Enquiry
            </>
          )}
        </button>
        <button
          type="button"
          onClick={openWhatsApp}
          disabled={status === "sending"}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-full border border-line py-3.5 text-sm text-text transition-colors hover:border-brass/50 disabled:opacity-60"
        >
          <MessageCircle size={16} /> Send via WhatsApp
        </button>
      </div>

      <p className="text-xs text-muted text-center">
        Your enquiry goes straight to our sales team. We usually reply within one business day.
      </p>
    </form>
  );
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
