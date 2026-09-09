import { HeroSection } from "@/components/sections/hero";
import { CatalogSection } from "@/components/sections/catalog-section";
import { OrderTimeline } from "@/components/tracking/order-timeline";
import { CheckoutSection } from "@/components/checkout/checkout-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <CatalogSection />

      <OrderTimeline />

      <CheckoutSection />
    </>
  );
}
