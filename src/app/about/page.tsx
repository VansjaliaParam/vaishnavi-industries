import type { Metadata } from "next";
import Story from "@/components/about/Story";
import Founders from "@/components/about/Founders";
import Values from "@/components/about/Values";
import Milestones from "@/components/about/Milestones";
import LocationBlock from "@/components/about/LocationBlock";

export const metadata: Metadata = {
  title: "About",
  description:
    "Over a decade of precision hardware manufacturing from Rajkot, Gujarat. Meet the founders, explore our history and see where we make every piece.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface border-b border-line pt-32 pb-14">
        <div className="container-lux">
          <span className="eyebrow">About Us</span>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-text leading-tight max-w-2xl">
            Crafted in{" "}
            <span className="text-brass-sheen">Rajkot,</span>{" "}
            trusted worldwide.
          </h1>
          <p className="mt-5 max-w-lg text-muted text-lg">
            From a single workshop to a 40,000 sq ft facility - here's the story.
          </p>
        </div>
      </section>
      <Story />
      <Founders />
      <Values />
      <Milestones />
      <LocationBlock />
    </>
  );
}
