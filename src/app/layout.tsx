import type { Metadata } from "next";
import { Prata, Sora } from "next/font/google";

import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const prata = Prata({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: "400"
});

export const metadata: Metadata = {
  title: "Shahi Vastram",
  description: "A modern full-stack ecommerce storefront for premium menswear occasionwear."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${sora.variable} ${prata.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to main content
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="main-content" className="min-h-[calc(100vh-8rem)]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
