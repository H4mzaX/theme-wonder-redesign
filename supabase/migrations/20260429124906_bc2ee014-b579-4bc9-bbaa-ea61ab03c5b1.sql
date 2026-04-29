
-- Orders table for custom checkout flow
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  cashfree_order_id TEXT UNIQUE,
  shopify_order_id TEXT,
  shopify_order_name TEXT,

  -- Customer
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,

  -- Shipping
  shipping_address JSONB NOT NULL,

  -- Items (snapshot from cart)
  line_items JSONB NOT NULL,

  -- Pricing (in paise/smallest unit, but we use rupees as numeric)
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,

  -- Payment
  payment_method TEXT NOT NULL CHECK (payment_method IN ('prepaid', 'partial_cod')),
  advance_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  cod_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  cashfree_payment_id TEXT,

  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),

  -- Optional notes / coupon
  coupon_code TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (guest checkout) — handled via edge function with service role anyway
-- but no public SELECT/UPDATE/DELETE. Order lookups happen through edge function.
CREATE POLICY "No public read of orders"
  ON public.orders FOR SELECT
  USING (false);

CREATE POLICY "No public write of orders"
  ON public.orders FOR INSERT
  WITH CHECK (false);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_orders_cashfree_order_id ON public.orders(cashfree_order_id);
CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
