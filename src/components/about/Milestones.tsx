"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { stagger, fadeUp } from "@/lib/motion";

const MILESTONES = [
  { year: "2013", event: "Founded", detail: "Dilip Hapaliya opens a 400 sq ft casting unit in Rajkot." },
  { year: "2016", event: "First Export", detail: "First shipment to a UAE distributor - 2,000 lever handles." },
  { year: "2018", event: "New Facility", detail: "Moved to a purpose-built factory with in-house CNC machining." },
  { year: "2021", event: "PVD Line", detail: "Launched in-house PVD coating - matte black and rose gold introduced." },
  { year: "2024", event: "250 Models", detail: "Catalog grows to 250+ distinct product models across bath accessories, door closers and handles." },
  { year: "2026", event: "5 Lakh+ Units", detail: "Production crosses five lakh units a year, shipping to six countries and counting." },
];

export default function Milestones() {
  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="History"
            title="Over a decade of craftsmanship."
            align="center"
          />
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.08, 0.1)}
          className="mt-14 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-line"
        >
          {MILESTONES.map(({ year, event, detail }) => (
            <motion.div
              key={year}
              variants={fadeUp}
              className="flex flex-col gap-2 bg-surface p-7 hover:bg-raised transition-colors"
            >
              <span className="font-display text-3xl font-bold text-brass">{year}</span>
              <h3 className="font-semibold text-text">{event}</h3>
              <p className="text-sm text-muted leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
