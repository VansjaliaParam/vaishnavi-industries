"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { EASE } from "@/lib/motion";

const QUOTES = [
  {
    quote: "Vaishnavi's lever handles transformed our hotel lobby. The antique brass finish held up through two years of heavy traffic without a single complaint from housekeeping.",
    author: "Deepak Mehrotra",
    role: "Project Manager, The Oberoi Group",
  },
  {
    quote: "We specify Vaishnavi on every high-end residential project. The model numbers make ordering replacement sets years later completely painless.",
    author: "Kavya Nair",
    role: "Principal Architect, Nair + Associates",
  },
  {
    quote: "MOQ was reasonable, lead time was as promised, and the quality-check report arrived before the shipment. Exactly what an importer needs.",
    author: "James Whitmore",
    role: "Procurement Director, Westhaven Interiors, UK",
  },
  {
    quote: "The matte black door stoppers look like they belong in an architecture magazine. Our clients notice the hardware - and that's exactly the point.",
    author: "Sara Lindström",
    role: "Interior Designer, Stockholm",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActive((v) => (v - 1 + QUOTES.length) % QUOTES.length);
  const next = () => setActive((v) => (v + 1) % QUOTES.length);

  return (
    <section className="py-24 md:py-32 bg-raised overflow-hidden">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="What Clients Say"
            title="Trusted by architects, hoteliers, and importers worldwide."
            align="center"
          />
        </Reveal>

        <div className="mt-16 max-w-3xl mx-auto relative">
          <span className="font-display text-[8rem] leading-none text-brass/20 select-none absolute -top-8 -left-4">"</span>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-center relative z-10"
            >
              <p className="font-display text-xl md:text-2xl text-text leading-relaxed font-medium italic">
                "{QUOTES[active].quote}"
              </p>
              <div className="mt-6">
                <p className="font-semibold text-text">{QUOTES[active].author}</p>
                <p className="text-sm text-muted">{QUOTES[active].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button onClick={prev} className="p-2 rounded-full border border-line text-muted hover:text-brass-text hover:border-brass/50 transition-colors" aria-label="Previous quote">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {QUOTES.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-6 bg-brass" : "w-1.5 bg-line"}`} aria-label={`Quote ${i + 1}`} />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full border border-line text-muted hover:text-brass-text hover:border-brass/50 transition-colors" aria-label="Next quote">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
