-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY,
    api_enabled BOOLEAN DEFAULT true
);

-- Insert default settings
INSERT INTO site_settings (id, api_enabled) VALUES (1, true)
ON CONFLICT (id) DO NOTHING;