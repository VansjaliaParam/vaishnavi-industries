"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Eye } from "lucide-react";
import { useEnquiry } from "@/context/EnquiryContext";
import { type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  onQuickView: (p: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { has, toggle } = useEnquiry();
  const selected = has(product.id);

  const blurbRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = blurbRef.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [product.blurb, expanded]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex flex-col rounded-2xl border overflow-hidden bg-raised transition-shadow duration-300",
        selected
          ? "border-brass shadow-brass-glow"
          : "border-line hover:border-brass/40 hover:shadow-lux"
      )}
    >
      {/* Image */}
      <div className="relative aspect-3/2 overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.collection ? `${product.name} - ${product.collection}` : product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Quick view ${product.name}`}
        >
          <span className="flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-sm px-4 py-2 text-sm text-white border border-white/10">
            <Eye size={14} /> Quick view
          </span>
        </button>

        <span className="absolute bottom-3 left-3 eyebrow text-[10px] bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
          {product.modelNo}
        </span>

        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-brass text-bg"
          >
            <Check size={12} strokeWidth={3} />
          </motion.span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-text leading-tight truncate">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted">{product.category}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {product.collection && <Badge variant="brass">{product.collection}</Badge>}
          <Badge variant="muted">{product.modelNo}</Badge>
        </div>

        {product.blurb && (
          <div className="mt-2">
            <p
              ref={blurbRef}
              className={cn(
                "text-xs leading-relaxed text-muted",
                !expanded && "line-clamp-2"
              )}
            >
              {product.blurb}
            </p>
            {(overflowing || expanded) && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-xs font-medium text-brass hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <button
            onClick={() => toggle(product.id)}
            className={cn(
              "w-full rounded-full py-2 text-sm font-medium transition-all duration-200",
              selected
                ? "bg-brass text-bg"
                : "border border-line text-muted hover:border-brass hover:text-brass-text"
            )}
            aria-pressed={selected}
          >
            {selected ? "✓ Added to enquiry" : "Add to enquiry"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
