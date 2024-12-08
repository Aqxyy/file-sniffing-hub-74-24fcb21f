-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    api_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings
INSERT INTO public.site_settings (api_enabled) VALUES (true);