"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Zap,
  Shield,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type CategoryFilter = "all" | "stock" | "preorder";
export type SortOption = "popular" | "price-asc" | "price-desc";
export type SizeStandard = "ARG" | "US" | "UK";

export interface CatalogFiltersProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  selectedSize: number | null;
  onSelectSize: (size: number | null) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  totalProducts?: number;
  className?: string;
}

const AVAILABLE_SIZES = [39, 40, 41, 42, 43, 44, 45];

// Equivalencias de talles para botines de fútbol
const SIZE_EQUIVALENTS: Record<number, { us: string; uk: string; cm: string }> = {
  39: { us: "7", uk: "6", cm: "25.0" },
  40: { us: "7.5", uk: "6.5", cm: "25.5" },
  41: { us: "8", uk: "7", cm: "26.0" },
  42: { us: "8.5", uk: "7.5", cm: "26.5" },
  43: { us: "9.5", uk: "8.5", cm: "27.5" },
  44: { us: "10", uk: "9", cm: "28.0" },
  45: { us: "10.5", uk: "9.5", cm: "28.5" },
};

export function CatalogFilters({
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  selectedSort,
  onSelectSort,
  totalProducts,
  className,
}: CatalogFiltersProps) {
  const [sizeStandard, setSizeStandard] = useState<SizeStandard>("ARG");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) + (selectedSize !== null ? 1 : 0);

  const handleReset = () => {
    onSelectCategory("all");
    onSelectSize(null);
    onSelectSort("popular");
  };

  const getDisplayedSize = (argSize: number) => {
    if (sizeStandard === "US") return `${SIZE_EQUIVALENTS[argSize]?.us || argSize} US`;
    if (sizeStandard === "UK") return `${SIZE_EQUIVALENTS[argSize]?.uk || argSize} UK`;
    return `${argSize} ARG`;
  };

  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-charcoal-100/90 p-4 shadow-xl backdrop-blur-md sm:p-6",
        className
      )}
    >
      {/* Barra superior de control en Mobile & Resumen */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold text-ivory">
                Filtros de Catálogo
              </h3>
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold border border-gold/40">
                  {activeFiltersCount} activo{activeFiltersCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-ivory/50">
              {totalProducts !== undefined
                ? `${totalProducts} modelo${totalProducts !== 1 ? "s" : ""} encontrado${totalProducts !== 1 ? "s" : ""}`
                : "Personalizá tu búsqueda de botines"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de limpiar filtros si hay alguno activo */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Limpiar filtros</span>
            </button>
          )}

          {/* Toggle en pantallas pequeñas */}
          <button
            type="button"
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="flex items-center gap-2 rounded-sm border border-white/15 bg-charcoal-50 px-3 py-1.5 text-xs text-ivory sm:hidden"
          >
            <span>{isOpenMobile ? "Ocultar" : "Mostrar filtros"}</span>
          </button>
        </div>
      </div>

      {/* Contenedor de filtros (siempre visible en desktop, colapsable en mobile) */}
      <div
        className={cn(
          "mt-5 space-y-6 sm:block",
          isOpenMobile ? "block" : "hidden sm:block"
        )}
      >
        {/* FILTRO 1: CATEGORÍA */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-ivory/50 mb-2.5">
            Categoría de Disponibilidad
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-sm border p-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                selectedCategory === "all"
                  ? "border-gold bg-gold/15 text-gold-light shadow-[0_0_15px_rgba(201,169,98,0.2)] ring-1 ring-gold/40"
                  : "border-white/10 bg-charcoal-50/50 text-ivory/70 hover:border-white/20 hover:text-ivory"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Todos</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory("stock")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-sm border p-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                selectedCategory === "stock"
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40"
                  : "border-white/10 bg-charcoal-50/50 text-ivory/70 hover:border-white/20 hover:text-ivory"
              )}
            >
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Stock Inmediato</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory("preorder")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-sm border p-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                selectedCategory === "preorder"
                  ? "border-gold/50 bg-gold/15 text-gold shadow-[0_0_15px_rgba(201,169,98,0.2)] ring-1 ring-gold/40"
                  : "border-white/10 bg-charcoal-50/50 text-ivory/70 hover:border-white/20 hover:text-ivory"
              )}
            >
              <Shield className="h-3.5 w-3.5 text-gold" />
              <span>Por Encargo (50% Seña)</span>
            </button>
          </div>
        </div>

        {/* FILTRO 2: TALLE + CONVERSOR (ARG / US / UK) */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ivory/50">
                Talle Disponible
              </label>
              {selectedSize && (
                <span className="text-[11px] font-mono text-gold font-medium">
                  ({getDisplayedSize(selectedSize)})
                </span>
              )}
            </div>

            {/* Switch de norma: ARG / US / UK */}
            <div className="inline-flex rounded-sm border border-white/10 bg-charcoal-50 p-0.5 text-[10px] font-mono">
              {(["ARG", "US", "UK"] as SizeStandard[]).map((std) => (
                <button
                  key={std}
                  type="button"
                  onClick={() => setSizeStandard(std)}
                  className={cn(
                    "px-2 py-0.5 rounded-sm uppercase transition-colors",
                    sizeStandard === std
                      ? "bg-gold text-charcoal font-bold shadow-sm"
                      : "text-ivory/50 hover:text-ivory"
                  )}
                >
                  {std}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón de todos los talles */}
            <button
              type="button"
              onClick={() => onSelectSize(null)}
              className={cn(
                "h-10 px-3.5 rounded-sm border text-xs font-medium transition-all duration-200",
                selectedSize === null
                  ? "border-gold bg-gold text-charcoal font-bold shadow-sm"
                  : "border-white/10 bg-charcoal-50 text-ivory/70 hover:border-gold/40 hover:text-gold"
              )}
            >
              Todos
            </button>

            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSize === size;
              const equivalent = SIZE_EQUIVALENTS[size];
              const label =
                sizeStandard === "US"
                  ? equivalent?.us || size
                  : sizeStandard === "UK"
                  ? equivalent?.uk || size
                  : size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(isSelected ? null : size)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[48px] h-10 px-2 rounded-sm border text-xs font-mono font-medium transition-all duration-200",
                    isSelected
                      ? "border-gold bg-gold/20 text-gold shadow-[0_0_15px_rgba(201,169,98,0.3)] ring-1 ring-gold"
                      : "border-white/10 bg-charcoal-50 text-ivory/80 hover:border-gold/50 hover:text-gold"
                  )}
                  title={`Equivalencia: ${size} ARG = ${equivalent?.us} US = ${equivalent?.uk} UK = ${equivalent?.cm} cm`}
                >
                  <span className="leading-none">{label}</span>
                  <span className="text-[9px] text-ivory/40 leading-none mt-0.5">
                    {equivalent?.cm}cm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTRO 3: ORDENAR POR */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-ivory/50 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-gold" />
              <span>Ordenar por:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 sm:max-w-xl">
              <button
                type="button"
                onClick={() => onSelectSort("popular")}
                className={cn(
                  "rounded-sm border px-3 py-2 text-xs font-medium transition-all text-center",
                  selectedSort === "popular"
                    ? "border-gold bg-gold/15 text-gold font-semibold"
                    : "border-white/10 bg-charcoal-50 text-ivory/70 hover:border-white/20"
                )}
              >
                Más Populares
              </button>

              <button
                type="button"
                onClick={() => onSelectSort("price-asc")}
                className={cn(
                  "rounded-sm border px-3 py-2 text-xs font-medium transition-all text-center",
                  selectedSort === "price-asc"
                    ? "border-gold bg-gold/15 text-gold font-semibold"
                    : "border-white/10 bg-charcoal-50 text-ivory/70 hover:border-white/20"
                )}
              >
                Menor a Mayor Precio
              </button>

              <button
                type="button"
                onClick={() => onSelectSort("price-desc")}
                className={cn(
                  "rounded-sm border px-3 py-2 text-xs font-medium transition-all text-center",
                  selectedSort === "price-desc"
                    ? "border-gold bg-gold/15 text-gold font-semibold"
                    : "border-white/10 bg-charcoal-50 text-ivory/70 hover:border-white/20"
                )}
              >
                Mayor a Menor Precio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogFilters;

