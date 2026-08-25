"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Design",
    desc: "Each piece starts as a sketch refined through CAD modelling - proportions, ergonomics, and finish compatibility all decided before metal is touched.",
  },
  {
    n: "02",
    title: "Casting & Forging",
    desc: "SS-304 stainless steel or zinc alloy poured into precision dies. Critical components are hot-forged for superior grain structure and long-term durability.",
  },
  {
    n: "03",
    title: "Machining",
    desc: "CNC turning and milling achieve sub-millimetre tolerances on every bearing surface, thread, and rose-plate seat.",
  },
  {
    n: "04",
    title: "Finishing",
    desc: "Six in-house finish lines - electroplating, PVD coating, and hand-applied patinas - applied and quality-checked under controlled conditions.",
  },
  {
    n: "05",
    title: "Quality Control",
    desc: "100% visual inspection, dimensional audit on sampled parts, and finish adhesion and smooth-operation checks before any batch ships.",
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.8", "end 0.2"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="How We Make It"
            title="From raw metal to finished hardware."
            align="center"
          />
        </Reveal>

        <div className="mt-16 relative max-w-3xl mx-auto">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-line md:left-1/2" />
          <motion.div
            className="absolute left-[27px] top-0 w-px bg-brass origin-top md:left-1/2"
            style={{ scaleY: lineScale, height: "100%" }}
          />

          <div className="flex flex-col gap-12">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.05}>
                <div className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-raised border border-line md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="eyebrow text-[11px]">{step.n}</span>
                  </div>
                  <div className={`flex-1 md:max-w-[calc(50%-3rem)] ${i % 2 === 0 ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"} pl-20 md:pl-0`}>
                    <h3 className="font-display text-xl font-semibold text-text mb-2">{step.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
