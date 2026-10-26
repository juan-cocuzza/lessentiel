import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estado de tu compra",
  description: "Consultá el estado de tu compra de botines de fútbol premium en L'essentiel.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
