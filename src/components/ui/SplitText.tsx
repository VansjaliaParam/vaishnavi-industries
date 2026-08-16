"use client";
import { motion, useReducedMotion } from "framer-motion";
import { stagger, revealChild } from "@/lib/motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className ?? ""}`}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger(0.06, delay)}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span className="inline-block" variants={revealChild}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
