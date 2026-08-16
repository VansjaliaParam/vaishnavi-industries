"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { products, seriesList, type Series } from "@/lib/products";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Each series has one styled scene shot for it, in /public/series. They are
 * composed square (1:1) and pieces run right to the edge of the frame - the
 * Afyon towel rail bleeds off the left - so the stage below is locked to
 * aspect-square and never crops them.
 *
 * Swatch and glow are sampled from each scene, so switching tabs shifts the
 * mood of the whole section rather than just swapping a picture.
 */
interface SeriesTheme {
  hero: string;
  /** Palette sampled from the scene, used for the tab swatch. */
  swatch: string;
  /** Ambient glow behind the frame, same palette at low alpha. */
  glow: string;
  /** Short palette name for the scene - colour only, no material claim. */
  tone: string;
  alt: string;
  desc: string;
}

const THEME: Record<Series, SeriesTheme> = {
  Afyon: {
    hero: "/series/afyon.jpg",
    swatch: "linear-gradient(140deg, #FCDCC4 0%, #F2A97E 48%, #D2734A 100%)",
    glow: "rgba(242, 169, 126, 0.45)",
    tone: "Apricot",
    alt: "Afyon series towel rail, napkin ring and tumbler holder staged against a warm apricot backdrop with flowers",
    desc: "Our flagship bath line - generous, sculpted forms in solid brass with a warm, architectural presence.",
  },
  Curio: {
    hero: "/series/curio.jpg",
    swatch: "linear-gradient(140deg, #F9F1E9 0%, #E7CDBB 48%, #C39781 100%)",
    glow: "rgba(231, 205, 187, 0.52)",
    tone: "Ivory blush",
    alt: "Curio series paper holder, robe hook and soap dish arranged on ivory tiles with a blush soap",
    desc: "Clean, contemporary silhouettes. Curio pairs slim profiles with a refined, understated finish.",
  },
  Opula: {
    hero: "/series/opula.jpg",
    swatch: "linear-gradient(140deg, #7A7D84 0%, #45474D 48%, #24252A 100%)",
    glow: "rgba(96, 99, 107, 0.50)",
    tone: "Charcoal",
    alt: "Opula series towel rail and twin soap dishes on a charcoal backdrop with red blooms",
    desc: "The most decorative of the three - statement detailing and a boutique-hotel feel for every surface.",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function SeriesShowcase() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeName = seriesList[active];
  const theme = THEME[activeName];
  const modelCount = products.filter((p) => p.collection === activeName).length;

  // Roving focus: arrows move between tabs the way a real tablist does.
  const goTo = (i: number) => {
    const next = (i + seriesList.length) % seriesList.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: seriesList.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      goTo(moves[e.key]);
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Three Bath Series"
          title="Afyon, Curio & Opula."
          subtitle="Every bathroom accessory is offered across three distinct design series - cast, plated and quality-checked at our Rajkot facility."
          align="center"
        />

        {/* Tab rail - swatches carry each scene's palette */}
        <Reveal delay={0.15}>
          <div
            role="tablist"
            aria-label="Bath series"
            onKeyDown={onKeyDown}
            className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {seriesList.map((name, i) => {
              const isActive = i === active;
              return (
                <button
                  key={name}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`series-tab-${name}`}
                  aria-selected={isActive}
                  aria-controls="series-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group relative flex items-center gap-2.5 rounded-full px-4 py-2.5 outline-hidden focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  {isActive && (
                    <motion.span
                      layoutId="series-tab-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-brass/50 bg-raised shadow-lux"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.45, ease: EASE }
                      }
                    />
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "relative h-6 w-6 rounded-full transition-all duration-300",
                      isActive
                        ? "ring-2 ring-brass/70 scale-110"
                        : "ring-1 ring-line group-hover:ring-brass/40"
                    )}
                    style={{ background: THEME[name].swatch }}
                  />
                  <span
                    className={cn(
                      "relative text-sm font-medium transition-colors",
                      isActive
                        ? "text-brass-text"
                        : "text-muted group-hover:text-text"
                    )}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Showcase */}
        <div
          role="tabpanel"
          id="series-panel"
          aria-labelledby={`series-tab-${activeName}`}
          className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16"
        >
          {/* Square stage - matches the 1:1 source exactly, so nothing is cropped */}
          <Reveal className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-150">
              {/* Ambient glow, tinted by the active series */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 -z-10 blur-3xl"
              >
                {seriesList.map((name, i) => (
                  <motion.div
                    key={name}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(60% 60% at 50% 50%, ${THEME[name].glow}, transparent 72%)`,
                    }}
                    animate={{ opacity: i === active ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
                  />
                ))}
              </div>

              <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-raised shadow-lux">
                {/*
                  All three stay mounted so switching tabs is instant. They are
                  ~0.5 MB combined and the reel below already pulls every
                  catalogue image, so this costs nothing.
                */}
                {seriesList.map((name, i) => (
                  <motion.div
                    key={name}
                    aria-hidden={i !== active}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: i === active ? 1 : 0,
                      scale: i === active ? 1 : 1.04,
                    }}
                    transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
                  >
                    <Image
                      src={THEME[name].hero}
                      alt={THEME[name].alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.div
              key={activeName}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-start"
            >
              <span className="eyebrow">
                {pad(active + 1)} / {pad(seriesList.length)}
              </span>

              <h3 className="mt-3 font-display text-4xl font-semibold leading-tight text-text md:text-5xl">
                {activeName}
              </h3>

              <p className="mt-4 max-w-md leading-relaxed text-muted">
                {theme.desc}
              </p>

              {/* Real numbers, straight from the catalogue */}
              <dl className="mt-8 flex items-stretch gap-6">
                <div>
                  <dt className="text-xs tracking-eyebrow text-muted uppercase">
                    Models
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-text">
                    {modelCount}
                  </dd>
                </div>
                <div className="w-px self-stretch bg-line" aria-hidden />
                <div>
                  <dt className="text-xs tracking-eyebrow text-muted uppercase">
                    Palette
                  </dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-4 w-4 rounded-full ring-1 ring-line"
                      style={{ background: theme.swatch }}
                    />
                    <span className="font-display text-lg font-semibold text-text">
                      {theme.tone}
                    </span>
                  </dd>
                </div>
              </dl>

              <Link
                href={`/products?category=${encodeURIComponent(
                  "Bath Accessories"
                )}&collection=${encodeURIComponent(activeName)}`}
                className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full border border-brass px-7 text-sm font-semibold text-brass-text transition-colors hover:bg-brass/10"
              >
                Explore {activeName}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
