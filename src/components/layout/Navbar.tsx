"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { site } from "@/lib/site.config";
import { useEnquiry } from "@/context/EnquiryContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { stagger, revealChild } from "@/lib/motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useEnquiry();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-bg/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="container-lux flex h-16 items-center justify-between md:h-18">
          {/* Logo + wordmark */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo-mark.png"
              alt=""
              width={298}
              height={256}
              priority
              className="h-8 w-auto shrink-0 md:h-9"
            />
            <span className="truncate font-display text-base font-semibold text-brass tracking-tight sm:text-lg md:text-xl">
              {site.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === l.href ? "text-brass" : "text-muted hover:text-text"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {count > 0 && (
              <Link href="/products" className="relative">
                <ShoppingBag size={20} className="text-muted hover:text-brass transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-bg text-[10px] font-bold">
                  {count}
                </span>
              </Link>
            )}
            <ThemeToggle />
            <Link
              href="/contact"
              className="inline-flex h-9 items-center rounded-full bg-brass-sheen px-5 text-sm font-semibold text-bg shadow-brass-glow hover:scale-105 transition-transform"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-text"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-lg flex flex-col items-center justify-center md:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={stagger(0.07, 0.1)}
              className="flex flex-col items-center gap-8"
            >
              {navLinks.map((l) => (
                <motion.div key={l.href} variants={revealChild} className="overflow-hidden">
                  <Link
                    href={l.href}
                    className="font-display text-4xl font-semibold text-text hover:text-brass transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={revealChild} className="overflow-hidden mt-4">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full bg-brass-sheen px-8 text-base font-semibold text-bg"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
