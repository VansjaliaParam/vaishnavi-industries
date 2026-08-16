"use client";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { site } from "@/lib/site.config";
import { buildWhatsAppLink } from "@/lib/enquiry";
import Reveal from "@/components/ui/Reveal";

export default function LocationBlock() {
  return (
    <section className="py-24 md:py-32 bg-bg">
      <div className="container-lux">
        <Reveal>
          <span className="eyebrow block mb-4">Find Us</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-text mb-12">
            Come visit the factory.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-7">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-brass mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text mb-0.5">Address</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.region} - {site.address.zip}
                    <br />
                    {site.address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={18} className="text-brass mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text mb-0.5">Phone</p>
                  <div className="flex flex-col gap-0.5">
                    {site.phones.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="text-sm text-muted hover:text-text transition-colors"
                      >
                        {p.display}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail size={18} className="text-brass mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text mb-0.5">Email</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-muted hover:text-text transition-colors"
                  >
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="text-brass mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text mb-0.5">Business Hours</p>
                  <p className="text-sm text-muted">Mon – Sat: 9:00 AM – 6:00 PM IST</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-2">
                <a
                  href={`tel:${site.phones[0].tel}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-text hover:border-brass/50 transition-colors"
                >
                  <Phone size={14} /> Call Us
                </a>
                <a
                  href={buildWhatsAppLink([])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brass-sheen px-5 py-2.5 text-sm font-semibold text-bg shadow-brass-glow hover:scale-105 transition-transform"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-text hover:border-brass/50 transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-4 pt-2">
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brass transition-colors" aria-label="Instagram"><InstagramIcon /></a>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.2}>
            <div className="h-80 lg:h-full min-h-80 rounded-2xl overflow-hidden border border-line">
              <iframe
                src={site.mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Vaishnavi Industries location"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
