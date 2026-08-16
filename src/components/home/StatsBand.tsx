"use client";
import { motion } from "framer-motion";
import { site } from "@/lib/site.config";
import Counter from "@/components/ui/Counter";
import { stagger, fadeIn } from "@/lib/motion";

export default function StatsBand() {
  return (
    <section className="bg-raised border-y border-line py-16">
      <div className="container-lux">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger(0.1, 0)}
          className="grid grid-cols-2 gap-y-10 md:grid-cols-4"
        >
          {site.stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeIn}
              className={`flex flex-col items-center gap-2 text-center ${i < site.stats.length - 1 ? "md:border-r md:border-line" : ""}`}
            >
              <span className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-none">
                <Counter
                  to={s.value}
                  suffix={s.suffix}
                  className="text-brass-sheen whitespace-nowrap tabular-nums"
                />
              </span>
              <span className="text-sm text-muted max-w-[150px] text-balance">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
