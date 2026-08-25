"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="container-lux">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-3/4 rounded-2xl overflow-hidden border border-line bg-raised">
            <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
              <Image
                src="/catalog/CU-206.jpg"
                alt="Chrome tumbler holder in polished finish, made by Vaishnavi Industries in Rajkot"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </motion.div>
          </div>

          {/* Text */}
          <div>
            <Reveal>
              <span className="eyebrow">Our Story</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold text-text leading-tight">
                Built from a single workshop. Shipped to the world.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-muted leading-relaxed">
                In 2013, Dilip Hapaliya set up a 400 sq ft casting unit in Rajkot with three employees
                and one product: a simple lever handle for local contractors. A little over a decade
                later, Vaishnavi Industries occupies a 40,000 sq ft precision-manufacturing facility
                and ships to architects, hoteliers, and distributors across six countries.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-muted leading-relaxed">
                What has not changed is the commitment to making hardware that outlasts the buildings
                it goes into. Every product is designed in-house, cast or forged from SS-304 stainless steel,
                and finished under the same roof - no outsourced platings, no shortcuts.
              </p>
            </Reveal>

            {/* Pull quote */}
            <Reveal delay={0.25}>
              <blockquote className="mt-8 border-l-2 border-brass pl-5">
                <p className="font-display text-lg italic text-text">
                  "Hardware is the handshake between architecture and the person who walks through the
                  door. It has to feel right."
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
