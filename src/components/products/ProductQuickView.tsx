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
            className="fixed inset-x-4 top-1/2 z-70 -translate-y-1/2 mx-auto max-w-2xl rounded-2xl bg-surface border border-line shadow-lux overflow-hidden md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square bg-raised">
                <Image src={product.image} alt={product.name} fill className="object-cover" priority />
              </div>

              <div className="flex flex-col gap-5 p-6">
                <div>
                  <span className="eyebrow">{product.category}</span>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-text">{product.name}</h2>
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

            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-muted hover:text-text transition-colors rounded-full hover:bg-raised"
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
