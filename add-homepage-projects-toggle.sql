-- Create a settings table to store global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the homepage projects visibility setting (default: visible)
INSERT INTO site_settings (setting_key, setting_value, description) 
VALUES ('homepage_projects_visible', 'true', 'Controls whether the featured projects section is visible on the homepage')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert the homepage "View Our Projects" button visibility setting (default: visible)
INSERT INTO site_settings (setting_key, setting_value, description) 
VALUES ('homepage_view_projects_button_visible', 'true', 'Controls whether the "View Our Projects" button is visible on the homepage')
ON CONFLICT (setting_key) DO NOTHING;

-- Create an index on setting_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access to settings
CREATE POLICY "Allow public read on site_settings" ON site_settings
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to update settings
CREATE POLICY "Allow authenticated users to update site_settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
