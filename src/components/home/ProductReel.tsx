"use client";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import Marquee from "@/components/ui/Marquee";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

function ReelCard({ id, name, modelNo, image, category }: {
  id: string;
  name: string;
  modelNo: string;
  image: string;
  category: string;
}) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category)}`}
      className="group relative mx-3 block h-64 w-96 overflow-hidden rounded-2xl border border-line bg-raised shrink-0 hover:border-brass/60 transition-colors"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="384px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="eyebrow text-[10px] mb-0.5">{modelNo}</p>
        <p className="text-sm font-semibold text-text leading-tight">{name}</p>
      </div>
    </Link>
  );
}

export default function ProductReel() {
  // Interleave by index so each row mixes categories and is wide enough
  // for the marquee to loop seamlessly (no gaps, no reset jump).
  const row1 = products.filter((_, i) => i % 2 === 0);
  const row2 = products.filter((_, i) => i % 2 === 1);

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-bg">
      <div className="container-lux mb-12">
        <SectionHeading
          eyebrow="Our Range"
          title="A reel of refined hardware."
          align="center"
        />
      </div>

      <Reveal>
        <Marquee speed={50}>
          {row1.map((p) => (
            <ReelCard key={p.id} {...p} />
          ))}
        </Marquee>
      </Reveal>

      <div className="mt-4">
        <Reveal>
          <Marquee speed={45} reverse>
            {row2.map((p) => (
              <ReelCard key={p.id} {...p} />
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
