-- Add is_snack column to products table
ALTER TABLE public.products ADD COLUMN is_snack boolean DEFAULT false;