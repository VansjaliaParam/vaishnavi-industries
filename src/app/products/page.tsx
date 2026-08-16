import type { Metadata } from "next";
import ProductCatalog from "@/components/products/ProductCatalog";
import { products, categories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our full catalog of bath accessories, door closers and handles. Select products and enquire via WhatsApp or email.",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; collection?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-line pt-24 pb-12">
        <div className="container-lux">
          <span className="eyebrow">Catalog</span>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold text-text leading-tight">
            Every piece,{" "}
            <span className="text-brass-sheen">modelled to last.</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted text-lg">
            {products.length} models across {categories.length} categories. Select the ones you need and enquire in one tap.
          </p>
        </div>
      </section>

      <ProductCatalog
        initialCategory={params.category}
        initialCollection={params.collection}
      />
    </>
  );
}
