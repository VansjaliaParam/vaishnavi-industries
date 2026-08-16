import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Send an enquiry about Vaishnavi Industries products via WhatsApp or email. No signup required - your message goes straight to our sales team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-surface border-b border-line pt-32 pb-14">
        <div className="container-lux">
          <span className="eyebrow">Get a Quote</span>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-text leading-tight max-w-2xl">
            Let&apos;s build{" "}
            <span className="text-brass-sheen">something solid.</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted text-lg">
            Fill in the form below and reach us directly - no middlemen, no waiting.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-lux">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
