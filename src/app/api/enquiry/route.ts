import { site } from "@/lib/site.config";
import { buildContactText } from "@/lib/enquiry";
import { getById, type Product } from "@/lib/products";

interface Payload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  qty?: string;
  message?: string;
  productIds?: string[];
  /** Honeypot - hidden from real users, bots fill it in. */
  website?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:7px 18px 7px 0;font:13px/1.4 ${sans};color:#8c8c8c;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:7px 0;font:14px/1.5 ${sans};color:#111">${esc(value) || "&mdash;"}</td>
  </tr>`;
}

function buildHtml(f: Required<Omit<Payload, "productIds" | "website">>, products: Product[]) {
  const items = products.length
    ? `<p style="margin:26px 0 8px;font:600 13px ${sans};color:#8c8c8c;text-transform:uppercase;letter-spacing:.06em">Products of interest</p>
       <ul style="margin:0;padding-left:20px;font:14px/1.7 ${sans};color:#111">
         ${products.map((p) => `<li>${esc(p.name)} <span style="color:#8c8c8c">(${esc(p.modelNo)})</span></li>`).join("")}
       </ul>`
    : "";

  return `<div style="max-width:560px;margin:0 auto;padding:28px 24px;background:#fff">
    <p style="margin:0 0 4px;font:600 13px ${sans};color:#b08d3f;text-transform:uppercase;letter-spacing:.08em">New website enquiry</p>
    <h1 style="margin:0 0 22px;font:600 22px ${sans};color:#111">${esc(f.name)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row("Email", f.email)}
      ${row("Phone", f.phone)}
      ${row("Company", f.company)}
      ${row("Interest", f.interest)}
      ${row("Quantity", f.qty)}
    </table>
    <p style="margin:26px 0 8px;font:600 13px ${sans};color:#8c8c8c;text-transform:uppercase;letter-spacing:.06em">Message</p>
    <p style="margin:0;font:14px/1.6 ${sans};color:#111;white-space:pre-wrap">${esc(f.message)}</p>
    ${items}
    <p style="margin:30px 0 0;padding-top:16px;border-top:1px solid #eee;font:12px ${sans};color:#aaa">
      Sent from the ${esc(site.name)} website. Reply to this email to answer ${esc(f.name)} directly.
    </p>
  </div>`;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; accept silently so they don't retry.
  if (clean(body.website)) return Response.json({ ok: true });

  const f = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    company: clean(body.company, 120),
    interest: clean(body.interest, 80),
    qty: clean(body.qty, 80),
    message: clean(body.message, 4000),
  };

  if (!f.name || !f.phone || !f.message || !EMAIL_RE.test(f.email)) {
    return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const products = (Array.isArray(body.productIds) ? body.productIds : [])
    .slice(0, 60)
    .map((id) => getById(clean(id, 80)))
    .filter(Boolean) as Product[];

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[enquiry] RESEND_API_KEY is not set - email not sent.");
    return Response.json({ error: "Email is not configured yet." }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM || "Website Enquiry <onboarding@resend.dev>",
      to: [process.env.ENQUIRY_TO || site.email],
      reply_to: f.email,
      subject: `Enquiry from ${f.name}${f.company ? ` - ${f.company}` : ""}`,
      html: buildHtml(f, products),
      text: buildContactText(f, products),
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend rejected the send:", res.status, await res.text());
    return Response.json({ error: "Could not send right now. Please try WhatsApp." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
