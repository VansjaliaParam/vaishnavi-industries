"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEnquiry } from "@/context/EnquiryContext";
import { getById } from "@/lib/products";
import { buildWhatsAppLink, buildMailtoLink } from "@/lib/enquiry";
import { EASE } from "@/lib/motion";

const MAX_THUMBS = 5;

export default function EnquiryBar() {
  const { ids, count, remove, clear } = useEnquiry();

  const openWhatsApp = () => {
    if (!count) return;
    window.open(buildWhatsAppLink(ids), "_blank", "noopener,noreferrer");
  };

  const openEmail = () => {
    if (!count) return;
    window.location.href = buildMailtoLink(ids);
  };

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed bottom-4 inset-x-4 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="rounded-2xl bg-surface border border-line shadow-lux backdrop-blur-md overflow-hidden md:min-w-[20rem]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
              {count <= MAX_THUMBS ? (
                <div className="flex gap-1.5 flex-1">
                  {ids.map((id) => {
                    const p = getById(id);
                    if (!p) return null;
                    return (
                      <div key={id} className="relative shrink-0 h-9 w-9 rounded-lg overflow-hidden border border-line group">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                        <button
                          onClick={() => remove(id)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/70 transition-opacity"
                          aria-label={`Remove ${p.name}`}
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="eyebrow text-[10px] flex-1">
                  {count} products selected
                </span>
              )}
              <button onClick={clear} className="shrink-0 p-1.5 text-muted hover:text-danger transition-colors" aria-label="Clear all selected products">
                <Trash2 size={15} />
              </button>
            </div>

            <div className="flex gap-2 px-4 py-3">
              <button
                onClick={openWhatsApp}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brass-sheen py-2.5 text-sm font-semibold text-bg shadow-brass-glow hover:scale-[1.02] transition-transform"
              >
                <MessageCircle size={15} /> WhatsApp
              </button>
              <button
                onClick={openEmail}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm text-text hover:border-brass/50 transition-colors"
              >
                <Mail size={15} /> Email
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
