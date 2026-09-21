import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { Product } from "./types";
import { MOCK_BOOTS, getMockProductById } from "./mock-data";

/**
 * Convierte un registro de producto proveniente de Supabase al formato Product de la aplicación
 */
export function mapSupabaseRowToProduct(row: any): Product {
  const images = Array.isArray(row.images)
    ? row.images
    : row.image
    ? [row.image]
    : [];

  const sizes = Array.isArray(row.sizes)
    ? row.sizes.map((s: any) => Number(s)).filter((n: number) => !isNaN(n))
    : [39, 40, 41, 42, 43, 44];

  const isByRequest = Boolean(row.is_by_request);

  return {
    id: String(row.id),
    name: row.name || "Botín L'essentiel",
    brand: row.brand || "L'essentiel",
    slug: row.slug || String(row.name || "botin").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: row.description || "",
    price: Number(row.price) || 0,
    image: images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"],
    is_by_request: isByRequest,
    availability: isByRequest ? "preorder" : "stock",
    category: row.category || (isByRequest ? "edicion-limitada" : "clasicos"),
    sizes: sizes.length > 0 ? sizes : [40, 41, 42, 43],
    featured: Boolean(row.featured),
    specs: row.specs || {
      sole_type: row.sole_type || "FG (Césped Firme)",
      material: row.material || "Cuero de alta calidad",
      weight: row.weight,
      origin: row.origin,
    },
    stock_quantity: row.stock_quantity ?? (isByRequest ? 0 : 10),
  };
}

/**
 * Obtiene los productos desde Supabase con fallback automático a mock-data.
 * Si Supabase no está configurado, la tabla no existe o hay un error de conexión,
 * devuelve la lista de botines de alta gama de mock-data.
 */
export async function getProductsWithFallback(): Promise<{
  products: Product[];
  fromFallback: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn(
          "[L'essentiel] Supabase no devolvió productos o no está configurado. Usando mock-data de alta gama:",
          error.message
        );
      }
      return { products: MOCK_BOOTS, fromFallback: true };
    }

    const mapped = data.map(mapSupabaseRowToProduct);
    return { products: mapped, fromFallback: false };
  } catch (err: any) {
    console.warn(
      "[L'essentiel] Error de conexión con Supabase. Activando mock-data de contingencia:",
      err?.message
    );
    return { products: MOCK_BOOTS, fromFallback: true };
  }
}

/**
 * Obtiene un producto individual por ID o Slug con fallback a mock-data.
 */
export async function getProductByIdWithFallback(
  idOrSlug: string
): Promise<{ product: Product | undefined; fromFallback: boolean }> {
  if (!idOrSlug) return { product: undefined, fromFallback: true };

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();

    if (!error && data) {
      return { product: mapSupabaseRowToProduct(data), fromFallback: false };
    }
  } catch (err) {
    console.warn(
      `[L'essentiel] No se pudo obtener el producto '${idOrSlug}' desde Supabase. Buscando en mock-data.`
    );
  }

  // Fallback a mock-data
  const mockProduct = getMockProductById(idOrSlug);
  return { product: mockProduct, fromFallback: true };
}

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

