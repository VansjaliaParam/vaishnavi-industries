"use client";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  divider?: boolean;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  divider = false,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <h2
        className={cn(
          "font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-tight text-text",
          titleClassName
        )}
      >
        <SplitText text={title} delay={eyebrow ? 0.1 : 0} />
      </h2>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="max-w-xl text-lg text-muted">{subtitle}</p>
        </Reveal>
      )}
      {divider && (
        <Reveal delay={0.25}>
          <div className="divider-lux mt-2 w-16" />
        </Reveal>
      )}
    </div>
  );
}
