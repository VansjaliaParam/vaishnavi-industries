"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail, Check } from "lucide-react";
import { type Product } from "@/lib/products";
import { useEnquiry } from "@/context/EnquiryContext";
import { whatsAppFor, mailtoFor } from "@/lib/enquiry";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { has, toggle } = useEnquiry();

  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  const selected = product ? has(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-bg/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-label={product.name}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-4 top-1/2 z-70 -translate-y-1/2 mx-auto max-h-[90dvh] max-w-2xl overflow-y-auto rounded-2xl bg-surface border border-line shadow-lux md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-5xl md:w-[calc(100vw-4rem)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr]">
              {/* Landscape source art (3:2). On desktop the panel stretches to the
                  row height set by the details column so no gap is left below it. */}
              <div className="relative aspect-3/2 bg-raised md:aspect-auto md:h-full md:min-h-[24rem]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              <div className="flex flex-col gap-5 p-6 md:p-8">
                <div>
                  <span className="eyebrow">{product.category}</span>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold text-text">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted font-mono">{product.modelNo}</p>
                </div>

                {product.blurb && <p className="text-sm text-muted leading-relaxed">{product.blurb}</p>}

                <div>
                  <p className="text-xs text-muted mb-2">Details</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="muted">{product.category}</Badge>
                    {product.collection && <Badge variant="brass">{product.collection}</Badge>}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <button
                    onClick={() => toggle(product.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all",
                      selected ? "bg-brass text-bg" : "border border-brass text-brass-text hover:bg-brass/10"
                    )}
                  >
                    {selected ? <><Check size={14} /> Added to enquiry</> : "Add to enquiry"}
                  </button>

                  <a
                    href={whatsAppFor(product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full py-2.5 text-sm text-text border border-line hover:border-brass/50 transition-colors"
                  >
                    <MessageCircle size={14} /> Enquire on WhatsApp
                  </a>

                  <a
                    href={mailtoFor(product.id)}
                    className="flex items-center justify-center gap-2 rounded-full py-2.5 text-sm text-muted border border-line hover:border-brass/30 hover:text-text transition-colors"
                  >
                    <Mail size={14} /> Enquire via Email
                  </a>
                </div>
              </div>
            </div>

            {/* Below md the close button overlaps the photo, so it carries its own scrim. */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 rounded-full bg-surface/70 p-2 text-muted backdrop-blur-sm transition-colors hover:text-text hover:bg-raised md:bg-transparent md:backdrop-blur-none"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
