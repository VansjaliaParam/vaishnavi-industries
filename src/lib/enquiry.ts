import { site } from "./site.config";
import { getById, type Product } from "./products";

function productLines(ids: string[]): string {
  const items = ids.map(getById).filter(Boolean) as Product[];
  return items.map((p, i) => `${i + 1}. ${p.name} (Model: ${p.modelNo})`).join("\n");
}

export function buildEnquiryText(ids: string[]): string {
  const header = `Hello ${site.name}, I'd like to enquire about the following ${ids.length} product(s):`;
  const footer = `Please share pricing, MOQ, and availability. Thank you.`;
  return `${header}\n\n${productLines(ids)}\n\n${footer}`;
}

export function buildWhatsAppLink(ids: string[]): string {
  const text = encodeURIComponent(buildEnquiryText(ids));
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function buildMailtoLink(ids: string[]): string {
  const subject = encodeURIComponent(`Product Enquiry - ${ids.length} item(s)`);
  const body = encodeURIComponent(buildEnquiryText(ids));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export const whatsAppFor = (id: string) => buildWhatsAppLink([id]);
export const mailtoFor = (id: string) => buildMailtoLink([id]);

export function buildContactText(
  f: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    interest?: string;
    qty?: string;
    message: string;
  },
  selected: Product[]
): string {
  const base = `New enquiry from the website:

Name: ${f.name}
Email: ${f.email}
Phone: ${f.phone}
Company: ${f.company || "-"}
Interest: ${f.interest || "-"}
Quantity: ${f.qty || "-"}

Message:
${f.message}`;

  const items =
    selected.length > 0
      ? `\n\nProducts of interest:\n` +
        selected.map((p, i) => `${i + 1}. ${p.name} (${p.modelNo})`).join("\n")
      : "";

  return base + items;
}
