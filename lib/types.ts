export type ProductAvailability = "stock" | "preorder";

export type ProductCategory = "clasicos" | "modernos" | "edicion-limitada";

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  availability: ProductAvailability;
  category: ProductCategory;
  sizes: number[];
  featured?: boolean;
}

export type TrackingStatus =
  | "entrada-calor"
  | "en-cancha"
  | "en-vestuario"
  | "tiempo-descuento"
  | "final-juego";

export interface TrackingStep {
  id: TrackingStatus;
  title: string;
  subtitle: string;
  description: string;
}

export interface SizeGuideEntry {
  size: number;
  cm: string;
  us: string;
  uk: string;
}

export type PaymentMethod = "mercadopago" | "transferencia";
