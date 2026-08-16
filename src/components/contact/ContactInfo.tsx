import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { site } from "@/lib/site.config";
import { buildWhatsAppLink } from "@/lib/enquiry";

export default function ContactInfo() {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-text mb-5">
          Other ways to reach us
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-brass mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-text mb-0.5">Visit the factory</p>
              <p className="text-sm text-muted leading-relaxed">
                {site.address.line1}, {site.address.line2}
                <br />{site.address.city}, {site.address.region} - {site.address.zip}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={16} className="text-brass mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-text mb-0.5">Phone</p>
              <div className="flex flex-col gap-0.5">
                {site.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="text-sm text-muted hover:text-text transition-colors">
                    {p.display}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={16} className="text-brass mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-text mb-0.5">Email</p>
              <a href={`mailto:${site.email}`} className="text-sm text-muted hover:text-text transition-colors">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-6">
        <p className="eyebrow mb-3">Instant reply</p>
        <p className="text-sm text-muted mb-4">
          For fast answers on pricing, MOQ, and availability - WhatsApp is the quickest.
        </p>
        <a
          href={buildWhatsAppLink([])}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-full bg-brass-sheen py-3 text-sm font-semibold text-bg shadow-brass-glow hover:scale-[1.02] transition-transform"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </div>
    </aside>
  );
}
