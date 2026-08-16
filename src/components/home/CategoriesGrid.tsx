"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories, getByCategory } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { stagger, scaleIn } from "@/lib/motion";

const CATEGORY_IMAGES: Record<string, string> = {
  "Bath Accessories": "/catalog/OP-301.jpg",
  "Door Closer": "/catalog/VD-101.jpg",
  Handles: "/catalog/AL-70.jpg",
};

const GRID_SPANS = ["", "", ""];

export default function CategoriesGrid() {
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container-lux">
        <Reveal>
          <SectionHeading eyebrow="Browse by Category" title="Every surface, covered." align="center" />
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.06, 0.1)}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {categories.map((cat, i) => {
            const count = getByCategory(cat).length;
            return (
              <motion.div key={cat} variants={scaleIn} className={GRID_SPANS[i]}>
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-raised"
                >
                  <Image
                    src={CATEGORY_IMAGES[cat]}
                    alt={cat}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/60" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="eyebrow text-[10px] mb-1">{count} models</span>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-white">{cat}</h3>
                      <ArrowRight size={16} className="text-brass translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
