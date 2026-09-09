import { createClient } from "@supabase/supabase-js";

export type OrderStatus =
  | "entrada-en-calor"
  | "en-cancha"
  | "en-vestuario"
  | "tiempo-de-descuento"
  | "final-del-juego";

export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  is_by_request: boolean;
  images: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
};

export type ProductInsert = {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  stock_quantity?: number;
  is_by_request?: boolean;
  images?: string[];
  sizes?: string[];
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = {
  id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  stock_quantity?: number;
  is_by_request?: boolean;
  images?: string[];
  sizes?: string[];
  created_at?: string;
  updated_at?: string;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: OrderStatus;
  is_preorder: boolean;
  deposit_paid: boolean;
  balance_paid: boolean;
  preference_id: string | null;
  items?: any[] | null;
  created_at: string;
};

export type OrderInsert = {
  id?: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status?: OrderStatus;
  is_preorder?: boolean;
  deposit_paid?: boolean;
  balance_paid?: boolean;
  preference_id?: string | null;
  items?: any[] | null;
  created_at?: string;
};

export type OrderUpdate = {
  id?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  status?: OrderStatus;
  is_preorder?: boolean;
  deposit_paid?: boolean;
  balance_paid?: boolean;
  preference_id?: string | null;
  items?: any[] | null;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "⚠️ [Supabase] Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa tu archivo .env.local."
    );
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

