import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { site } from "@/lib/site.config";
import { categories } from "@/lib/products";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Get a Quote" },
];

export default function Footer() {
  return (
    /* Force dark in both themes - footer stays dark for contrast */
    <footer className="dark bg-surface border-t border-line">
      <div className="container-lux py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            {/* The lockup ships pre-recoloured for this dark surface - see scripts/build-logos.mjs */}
            <Image
              src="/logo-full-light.png"
              alt={`${site.name} - Vishu Exclusive Hardware Fittings`}
              width={520}
              height={575}
              className="h-auto w-37.5 md:w-42.5"
            />
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Precision door and furnishing hardware, crafted for spaces that demand the finest.
            </p>
            <div className="flex gap-4 mt-2">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brass-text transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted hover:text-text transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="eyebrow mb-5">Products</p>
            <ul className="flex flex-col gap-3">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/products?category=${encodeURIComponent(c)}`} className="text-sm text-muted hover:text-text transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-brass mt-0.5 shrink-0" />
                <span className="text-sm text-muted leading-relaxed">
                  {site.address.line1}, {site.address.line2}<br />
                  {site.address.city}, {site.address.region} {site.address.zip}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-brass mt-0.5 shrink-0" />
                <span className="flex flex-col gap-1">
                  {site.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="text-sm text-muted hover:text-text transition-colors">{p.display}</a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-brass shrink-0" />
                <a href={`mailto:${site.email}`} className="text-sm text-muted hover:text-text transition-colors">{site.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="italic">Crafted with precision.</span>
        </div>
      </div>
    </footer>
  );
}
