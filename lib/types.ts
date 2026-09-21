export type ProductAvailability = "stock" | "preorder";

export type ProductCategory = "clasicos" | "modernos" | "edicion-limitada";

export interface ProductSpecs {
  sole_type: string; // Tipo de suela: FG, SG, AG, Mixta, etc.
  upper_material: string; // Material del empeine: cuero, sintético, etc.
  material?: string; // Alias legado para registros existentes.
  weight?: string;   // Peso aproximado: ej. "198g"
  origin?: string;   // Taller / Confección: ej. "Montebelluna, Italia"
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  description: string;
  price: number;
  active?: boolean;
  deposit_price?: number;
  image: string;
  images?: string[];
  is_by_request?: boolean;
  availability: ProductAvailability;
  category: ProductCategory;
  sizes: number[];
  featured?: boolean;
  specs?: ProductSpecs;
  stock_quantity?: number;
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
