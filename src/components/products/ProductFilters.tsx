"use client";
import { Search } from "lucide-react";
import { type Category, type Collection, categories } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  selectedCategory: Category | "All";
  selectedCollection: Collection | "All";
  collectionLabel: string;
  collectionOptions: Collection[];
  search: string;
  resultCount: number;
  totalCount: number;
  onCategory: (c: Category | "All") => void;
  onCollection: (c: Collection | "All") => void;
  onSearch: (s: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const pill = (active: boolean) =>
  cn(
    "inline-flex h-8 items-center rounded-full px-4 text-xs font-medium transition-all duration-200 cursor-pointer border",
    active
      ? "bg-brass text-bg border-brass"
      : "border-line text-muted hover:border-brass/50 hover:text-text bg-transparent"
  );

export default function ProductFilters({
  selectedCategory,
  selectedCollection,
  collectionLabel,
  collectionOptions,
  search,
  resultCount,
  totalCount,
  onCategory,
  onCollection,
  onSearch,
  onSelectAll,
  onClearAll,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-5 sticky top-20">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="search"
          placeholder="Search by name or model…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-full bg-raised border border-line pl-9 pr-4 py-2.5 text-sm text-text placeholder-muted/60 focus:outline-none focus:border-brass transition-colors"
        />
      </div>

      <p className="text-xs text-muted">
        Showing <span className="text-text font-medium">{resultCount}</span> of {totalCount}
      </p>

      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          <button className={pill(selectedCategory === "All")} onClick={() => onCategory("All")}>All</button>
          {categories.map((c) => (
            <button key={c} className={pill(selectedCategory === c)} onClick={() => onCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {collectionOptions.length > 0 && (
        <div>
          <p className="eyebrow mb-3">{collectionLabel}</p>
          <div className="flex flex-wrap gap-2">
            <button className={pill(selectedCollection === "All")} onClick={() => onCollection("All")}>All</button>
            {collectionOptions.map((c) => (
              <button key={c} className={pill(selectedCollection === c)} onClick={() => onCollection(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onSelectAll} className="text-xs text-brass-text hover:underline">Select all visible</button>
        <span className="text-muted text-xs">·</span>
        <button onClick={onClearAll} className="text-xs text-muted hover:text-text">Clear all</button>
      </div>
    </div>
  );
}
