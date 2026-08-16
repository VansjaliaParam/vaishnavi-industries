import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "@/context/EnquiryContext";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Grain from "@/components/ui/Grain";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/theme/ThemeProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s · Vaishnavi Industries",
    default: "Vaishnavi Industries - Hardware, perfected.",
  },
  description:
    "Premium bath accessories, door closers and handles. Engineered in India, shipped worldwide.",
  openGraph: {
    siteName: "Vaishnavi Industries",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body>
        <ThemeProvider>
          <EnquiryProvider>
            <SmoothScroll>
              <Grain />
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SmoothScroll>
          </EnquiryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
