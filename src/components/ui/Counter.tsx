"use client";
import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface CounterProps {
  to: number;
  suffix?: string;
  /** Roll time of the leftmost digit; each digit to its right takes slightly longer. */
  duration?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// Expo-out: the strip spins hard, then eases into its final digit.
const ROLL_EASE = [0.16, 1, 0.3, 1] as const;

interface DigitRollProps {
  digit: number;
  revolutions: number;
  duration: number;
  play: boolean;
  /** Applied per cell, not to the column: see the note in the strip below. */
  cellClassName?: string;
}

/**
 * One odometer column: `revolutions` full 0-9 cycles ending on `digit`.
 * Every column carries all ten glyphs, so each is exactly as wide as the
 * widest digit and the number never reflows mid-roll.
 */
function DigitRoll({ digit, revolutions, duration, play, cellClassName }: DigitRollProps) {
  const cells = useMemo(() => {
    const out: number[] = [];
    for (let r = 0; r < revolutions; r++) out.push(...DIGITS);
    out.push(digit);
    return out;
  }, [digit, revolutions]);

  // Travel from the first cell to the last, as a share of the strip's height.
  const shift = -((cells.length - 1) / cells.length) * 100;

  return (
    <span className="inline-block h-[1.15em] overflow-hidden">
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: play ? `${shift}%` : 0 }}
        transition={{ duration, ease: ROLL_EASE }}
      >
        {/* The gradient rides on each cell rather than an ancestor: this strip is
            transformed, and a transformed subtree paints outside an ancestor's
            `background-clip: text`, which renders the digits invisible. */}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`flex h-[1.15em] items-center justify-center ${cellClassName ?? ""}`}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function Counter({ to, suffix = "", duration = 1.4, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();

  const chars = useMemo(() => to.toLocaleString("en-IN").split(""), [to]);
  const label = to.toLocaleString("en-IN") + suffix;

  if (reduceMotion) {
    return (
      <span ref={ref} className={className}>
        {label}
      </span>
    );
  }

  let digitIndex = -1;

  return (
    <span ref={ref}>
      {/* Screen readers and no-JS get the plain number; the roll is decorative. */}
      <span className="sr-only">{label}</span>
      {/* The caller's gradient lives here, not on the wrapper: its background box
          has to be as tall as the digit cells or the glyph tops clip away. */}
      <span aria-hidden className={`inline-flex items-center ${className ?? ""}`}>
        {chars.map((c, i) => {
          if (c < "0" || c > "9") return <span key={i}>{c}</span>;
          digitIndex++;
          return (
            <DigitRoll
              key={i}
              digit={Number(c)}
              // Rightmost column spins through the most numbers.
              revolutions={1 + digitIndex}
              // ...and settles last, so the number resolves left to right.
              duration={duration + digitIndex * 0.15}
              play={inView}
              cellClassName={className}
            />
          );
        })}
        {suffix && <span className="whitespace-pre">{suffix}</span>}
      </span>
    </span>
  );
}
