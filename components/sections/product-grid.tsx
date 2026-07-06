"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { SizeGuide } from "@/components/product/size-guide";

interface ProductGridProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

export function ProductGrid({ id, title, subtitle, products }: ProductGridProps) {
  return (
    <section id={id} className="section-padding scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps mb-2">{subtitle}</p>
            <h2 className="heading-section">{title}</h2>
          </div>
          <SizeGuide
            trigger={
              <button className="self-start text-sm font-medium uppercase tracking-wider text-gold underline-offset-4 hover:underline sm:self-auto">
                Guía de talles →
              </button>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
