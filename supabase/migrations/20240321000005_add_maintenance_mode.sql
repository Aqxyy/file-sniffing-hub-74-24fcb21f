-- Add maintenance_mode column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;