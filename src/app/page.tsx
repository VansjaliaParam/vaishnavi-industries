import Hero from "@/components/home/Hero";
import ProductReel from "@/components/home/ProductReel";
import SeriesShowcase from "@/components/home/SeriesShowcase";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import StatsBand from "@/components/home/StatsBand";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <SeriesShowcase />
      <ProductReel />
      <CategoriesGrid />
      <StatsBand />
      <ProcessTimeline />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
