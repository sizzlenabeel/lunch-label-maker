ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS storytel_delivery_days text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS is_vegetarian boolean NOT NULL DEFAULT false;