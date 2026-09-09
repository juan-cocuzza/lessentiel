"use client";

import React, { useState, useMemo } from "react";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";
import {
  CatalogFilters,
  type CategoryFilter,
  type SortOption,
} from "@/components/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import { SizeGuide } from "@/components/product/size-guide";
import { Sparkles, Trophy } from "lucide-react";

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>("popular");

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filtrar por categoría
    if (selectedCategory === "stock") {
      result = result.filter(
        (p) => !p.is_by_request && p.availability === "stock"
      );
    } else if (selectedCategory === "preorder") {
      result = result.filter(
        (p) => p.is_by_request || p.availability === "preorder"
      );
    }

    // 2. Filtrar por talle
    if (selectedSize !== null) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // 3. Ordenar
    if (selectedSort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "popular") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedSize, selectedSort]);

  return (
    <section id="catalogo" className="section-padding scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps mb-2 text-gold">Colección Oficial</p>
            <h2 className="heading-section">Catálogo de Botines</h2>
          </div>

          <SizeGuide
            trigger={
              <button className="self-start text-xs font-semibold uppercase tracking-wider text-gold underline-offset-4 hover:underline sm:self-auto flex items-center gap-1.5">
                <span>Guía de talles para botines →</span>
              </button>
            }
          />
        </div>

        {/* Componente de Filtros de Catálogo */}
        <CatalogFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          totalProducts={filteredProducts.length}
          className="mb-10"
        />

        {/* Grilla de productos filtrados */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-charcoal-50/50 p-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gold/40 mb-3" />
            <h3 className="font-display text-xl font-medium text-ivory">
              No hay botines con esos filtros
            </h3>
            <p className="mt-2 text-sm text-ivory/60 max-w-md mx-auto">
              Probá seleccionando otro talle o cambiando la categoría para ver más modelos disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

