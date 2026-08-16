"use client";
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Category,
  type Collection,
  products,
  filterProducts,
  collectionsForCategory,
} from "@/lib/products";
import { useEnquiry } from "@/context/EnquiryContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import ProductQuickView from "./ProductQuickView";
import EnquiryBar from "./EnquiryBar";
import { type Product } from "@/lib/products";

interface ProductCatalogProps {
  initialCategory?: string;
  initialCollection?: string;
}

export default function ProductCatalog({
  initialCategory,
  initialCollection,
}: ProductCatalogProps) {
  const [category, setCategory] = useState<Category | "All">(
    (initialCategory as Category) || "All"
  );
  // Only honour a deep-linked collection that actually belongs to the
  // deep-linked category, so ?collection= can't strand the grid on an
  // option the filter sidebar isn't offering.
  const [collection, setCollection] = useState<Collection | "All">(() => {
    const { options } = collectionsForCategory(
      (initialCategory as Category) || "All"
    );
    return options.includes(initialCollection as Collection)
      ? (initialCollection as Collection)
      : "All";
  });
  const [search, setSearch] = useState("");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const { addMany, clear } = useEnquiry();

  const { label: collectionLabel, options: collectionOptions } =
    collectionsForCategory(category);

  // Changing category resets the contextual collection filter.
  const handleCategory = (c: Category | "All") => {
    setCategory(c);
    setCollection("All");
  };

  const filtered = useMemo(
    () => filterProducts({ category, collection, search }),
    [category, collection, search]
  );

  const handleSelectAll = () => addMany(filtered.map((p) => p.id));

  return (
    <section className="container-lux py-12 pb-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <ProductFilters
            selectedCategory={category}
            selectedCollection={collection}
            collectionLabel={collectionLabel}
            collectionOptions={collectionOptions}
            search={search}
            resultCount={filtered.length}
            totalCount={products.length}
            onCategory={handleCategory}
            onCollection={setCollection}
            onSearch={setSearch}
            onSelectAll={handleSelectAll}
            onClearAll={clear}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickView}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-muted text-lg">No products match your filters.</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setCollection("All");
                  setSearch("");
                }}
                className="mt-4 text-sm text-brass hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick view */}
      <ProductQuickView product={quickView} onClose={() => setQuickView(null)} />

      {/* Floating enquiry bar */}
      <EnquiryBar />
    </section>
  );
}
