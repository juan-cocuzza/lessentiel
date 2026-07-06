import { HeroSection } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { OrderTimeline } from "@/components/tracking/order-timeline";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { stockProducts, preorderProducts } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <ProductGrid
        id="stock"
        title="Stock Inmediato"
        subtitle="Disponible ahora"
        products={stockProducts}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <ProductGrid
        id="encargo"
        title="Pedidos por Encargo"
        subtitle="Exclusividad bajo pedido"
        products={preorderProducts}
      />

      <OrderTimeline />

      <CheckoutSection />
    </>
  );
}
