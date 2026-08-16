"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/lib/site.config";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { stagger, scaleIn } from "@/lib/motion";

export default function Founders() {
  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="The Team"
            title="The people behind the precision."
            align="center"
          />
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.12, 0.1)}
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-3xl mx-auto"
        >
          {site.founders.map((f) => (
            <motion.div
              key={f.name}
              variants={scaleIn}
              className="group flex flex-col items-center text-center rounded-2xl border border-line bg-raised p-8 hover:border-brass/40 hover:shadow-lux transition-all duration-300"
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-line group-hover:border-brass transition-colors duration-300 mb-5 bg-surface">
                <Image
                  src={f.photo}
                  alt={`${f.name}, ${f.role} of ${site.name}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <span className="eyebrow mb-1">{f.role}</span>
              <h3 className="font-display text-xl font-semibold text-text">{f.name}</h3>
              {f.bio && <p className="mt-3 text-sm text-muted leading-relaxed">{f.bio}</p>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
