-- ==============================================================================
-- L'essentiel - Configuración de Base de Datos Supabase (PostgreSQL)
-- ==============================================================================

-- 1. Crear ENUM para el estado de los pedidos
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'entrada-en-calor',
    'en-cancha',
    'en-vestuario',
    'tiempo-de-descuento',
    'final-del-juego'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Crear tabla: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_by_request BOOLEAN NOT NULL DEFAULT false,
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Crear tabla: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status order_status NOT NULL DEFAULT 'entrada-en-calor',
  is_preorder BOOLEAN NOT NULL DEFAULT false,
  deposit_paid BOOLEAN NOT NULL DEFAULT false,
  balance_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Índices para optimizar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_products_is_by_request ON products (is_by_request);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- 5. Trigger opcional para mantener actualizado el campo updated_at en products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 6. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para products:
-- Lectura pública para cualquier visitante de la tienda
CREATE POLICY "Permitir lectura pública de productos"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para orders:
-- Permitir a los clientes generar pedidos (inserción pública / anónima)
CREATE POLICY "Permitir inserción de órdenes para clientes"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir lectura de pedidos (puedes restringirla según tu lógica de autenticación o token de seguimiento)
CREATE POLICY "Permitir lectura pública de pedidos"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

