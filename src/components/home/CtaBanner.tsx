"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import SplitText from "@/components/ui/SplitText";
import { buildWhatsAppLink } from "@/lib/enquiry";
import Reveal from "@/components/ui/Reveal";

export default function CtaBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    /* Force dark in both themes - this band is intentionally always dark for contrast */
    <section ref={ref} className="dark relative overflow-hidden py-28 md:py-40 bg-surface">
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(198,161,91,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,91,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      <div className="container-lux relative z-10 text-center">
        <Reveal>
          <span className="eyebrow block mb-4">Ready to specify?</span>
        </Reveal>

        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-text leading-tight mb-6">
          <SplitText text="Have a project in mind?" delay={0.05} />
          <br />
          <SplitText text="Let's talk hardware." delay={0.25} className="text-brass-sheen" />
        </h2>

        <Reveal delay={0.3}>
          <p className="max-w-md mx-auto text-lg text-muted mb-10">
            From a single lever to a complete hotel fit-out - our team responds within 24 hours.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton>
              <Link
                href="/products"
                className="inline-flex h-13 items-center rounded-full bg-brass-sheen px-9 text-base font-semibold text-bg shadow-brass-glow hover:scale-105 transition-transform"
              >
                Browse Products
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={buildWhatsAppLink([])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-brass text-brass px-9 text-base font-semibold hover:bg-brass/10 transition-colors"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
