"use client";
import { motion } from "framer-motion";
import { Hammer, Globe, ShieldCheck, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { stagger, fadeUp } from "@/lib/motion";

const VALUES = [
  {
    Icon: Hammer,
    title: "In-House Manufacturing",
    desc: "Casting, machining, and finishing all happen under one roof in Rajkot - no third-party plating, no quality surprises.",
  },
  {
    Icon: ShieldCheck,
    title: "Precision Engineering",
    desc: "Sub-millimetre CNC tolerances on every bearing surface. Hardware that feels as precise as it looks.",
  },
  {
    Icon: Sparkles,
    title: "Built to Last",
    desc: "SS-304 stainless steel construction and corrosion-resistant finishes. Vaishnavi hardware outlasts the projects it's specified for.",
  },
  {
    Icon: Globe,
    title: "Global Delivery",
    desc: "Export-ready documentation, reliable lead times, and a team that responds within 24 hours - wherever you are.",
  },
];

export default function Values() {
  return (
    <section className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="Why Vaishnavi"
            title="Four reasons architects keep coming back."
            align="center"
          />
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.1, 0.1)}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group flex flex-col gap-4 rounded-2xl border border-line bg-raised p-6 hover:border-brass/40 hover:shadow-brass-glow transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass/10 group-hover:bg-brass/20 transition-colors">
                <Icon size={20} className="text-brass" />
              </div>
              <h3 className="font-display text-lg font-semibold text-text">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
