
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "L'essentiel | Botines de Fútbol Premium",
    template: "%s | L'essentiel",
  },
  description:
    "Botines de fútbol de alta gama con el alma de Maradona. Stock inmediato y pedidos por encargo exclusivos.",
  keywords: [
    "botines de fútbol",
    "fútbol premium",
    "Maradona",
    "L'essentiel",
    "calzado deportivo",
  ],
  openGraph: {
    title: "L'essentiel | Botines de Fútbol Premium",
    description:
      "Botines de fútbol premium con la mística de Maradona, stock inmediato y piezas únicas por encargo.",
    type: "website",
    locale: "es_AR",
    siteName: "L'essentiel",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "L'essentiel | Botines de Fútbol Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'essentiel | Botines de Fútbol Premium",
    description:
      "Botines premium con la mística de Maradona y confección por encargo.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${playfair.variable} ${montserrat.variable} min-h-screen bg-charcoal text-ivory antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
