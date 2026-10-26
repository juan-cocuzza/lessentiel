"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";
import { MOCK_BOOTS } from "./mock-data";
import { getProductsWithFallback, mergeLocalProducts } from "./products";

/**
 * Hook de React para consumir los productos en componentes de cliente
 * con carga instantánea de mock-data y sincronización reactiva con Supabase.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_BOOTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setProducts(mergeLocalProducts(MOCK_BOOTS));

    async function load() {
      const result = await getProductsWithFallback();
      if (isMounted) {
        setProducts(result.products);
        setIsUsingFallback(result.fromFallback);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, isUsingFallback };
}

