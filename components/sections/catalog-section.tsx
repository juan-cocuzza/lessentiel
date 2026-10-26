"use client";

import React, { useState, useMemo, useTransition, useEffect } from "react";
import { useProducts } from "@/lib/use-products";
import {
  CatalogFilters,
  type CategoryFilter,
  type SortOption,
} from "@/components/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import { SizeGuide } from "@/components/product/size-guide";
import { Loader2, Trophy } from "lucide-react";

export function CatalogSection() {
  const { products, isLoading } = useProducts();
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>("popular");

  useEffect(() => {
    const syncCategory = () => {
      const category = window.location.hash === "#stock" ? "stock" : window.location.hash === "#encargo" ? "preorder" : null;
      if (category) startTransition(() => setSelectedCategory(category));
    };
    syncCategory();
    window.addEventListener("hashchange", syncCategory);
    return () => window.removeEventListener("hashchange", syncCategory);
  }, []);

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => product.active !== false);

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
  }, [products, selectedCategory, selectedSize, selectedSort]);

  return (
    <section id="catalogo" className="section-padding relative scroll-mt-24">
      <span id="stock" className="absolute top-0 scroll-mt-24" aria-hidden="true" />
      <span id="encargo" className="absolute top-0 scroll-mt-24" aria-hidden="true" />
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
          onSelectCategory={(category) => startTransition(() => setSelectedCategory(category))}
          selectedSize={selectedSize}
          onSelectSize={(size) => startTransition(() => setSelectedSize(size))}
          selectedSort={selectedSort}
          onSelectSort={(sort) => startTransition(() => setSelectedSort(sort))}
          totalProducts={filteredProducts.length}
          className="mb-10"
        />

        <div role="status" aria-live="polite" className="mb-4 min-h-5 text-xs text-gold">
          {isLoading || isPending ? (
            <span className="flex items-center gap-2"><Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />{isLoading ? "Actualizando catálogo..." : "Aplicando filtros..."}</span>
          ) : `${filteredProducts.length} modelos encontrados`}
        </div>
        <div aria-busy={isLoading || isPending} className={isPending ? "opacity-60" : undefined}>
        {/* Grilla de productos filtrados */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-charcoal-50/50 px-4 py-12 sm:p-16 text-center">
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
      </div>
    </section>
  );
}

