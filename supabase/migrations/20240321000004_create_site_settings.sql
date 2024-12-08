-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    api_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings if not exists
INSERT INTO public.site_settings (api_enabled)
SELECT true
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Grant necessary permissions
GRANT SELECT ON public.site_settings TO authenticated;
GRANT SELECT ON public.site_settings TO anon;