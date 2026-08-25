"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";
import { stagger, fadeIn, EASE } from "@/lib/motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(198,161,91,0.12), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={ref}
      className="dark relative flex min-h-screen items-center overflow-hidden bg-bg"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-bg" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(198,161,91,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,91,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: spotlightBg }}
      />

      {/* Content */}
      <div className="container-lux relative z-10 pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.07, 0.1)}
          className="max-w-4xl"
        >
          <motion.span variants={fadeIn} className="eyebrow block mb-6">
            Precision Door & Furnishing Hardware
          </motion.span>

          <h1 className="font-display text-[clamp(2.75rem,6vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em] text-text mb-6">
            Hardware that{" "}
            <span className="text-brass-sheen">
              <SplitText text="defines the room." delay={0.15} />
            </span>
          </h1>

          <motion.p variants={fadeIn} className="max-w-xl text-lg text-muted leading-relaxed mb-10">
            Bath accessories, door closers and handles - SS-304 stainless steel, precision-machined.
            Shipped to 6+ countries from our Gujarat factory.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
            <MagneticButton>
              <Link
                href="/products"
                className="inline-flex h-13 items-center rounded-full bg-brass-sheen px-9 text-base font-semibold text-bg shadow-brass-glow hover:shadow-[0_0_60px_-8px_rgba(198,161,91,0.65)] hover:scale-[1.03] transition-all duration-300"
              >
                Explore Products
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex h-13 items-center rounded-full border border-brass text-brass px-9 text-base font-semibold hover:bg-brass/10 transition-colors"
              >
                Get a Quote
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12 flex items-center gap-4">
            <span className="text-xs text-muted">Bath series:</span>
            {[
              { label: "Afyon", color: "#C6A15B" },
              { label: "Curio", color: "#A8A8A8" },
              { label: "Opula", color: "#D4B483" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="h-4 w-4 rounded-full border border-white/10"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-muted">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
