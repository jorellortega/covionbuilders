-- Create the ai_settings table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_settings_key ON ai_settings(setting_key);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows only authenticated users with CEO role to view settings
CREATE POLICY "Allow CEO to view ai_settings" ON ai_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ceo'
    )
  );

-- Create a function to get AI settings for API use
-- This function can be called from API routes without exposing RLS restrictions
CREATE OR REPLACE FUNCTION get_ai_settings()
RETURNS TABLE(setting_key TEXT, setting_value TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ai_settings.setting_key, ai_settings.setting_value
  FROM ai_settings
  WHERE ai_settings.setting_key IN ('openai_api_key', 'openai_model', 'anthropic_api_key', 'anthropic_model');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_ai_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION get_ai_settings() TO anon;

-- Create a policy that allows only authenticated users with CEO role to insert settings
CREATE POLICY "Allow CEO to insert ai_settings" ON ai_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ceo'
    )
  );

-- Create a policy that allows only authenticated users with CEO role to update settings
CREATE POLICY "Allow CEO to update ai_settings" ON ai_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ceo'
    )
  );

-- Create a policy that allows only authenticated users with CEO role to delete settings
CREATE POLICY "Allow CEO to delete ai_settings" ON ai_settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ceo'
    )
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_ai_settings_updated_at 
    BEFORE UPDATE ON ai_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_ai_settings_updated_at();

-- Insert default AI settings keys (with empty values)
INSERT INTO ai_settings (setting_key, setting_value, description) VALUES
  ('openai_api_key', '', 'OpenAI API Key for GPT models'),
  ('openai_model', 'gpt-4', 'OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo)'),
  ('anthropic_api_key', '', 'Anthropic API Key for Claude models'),
  ('anthropic_model', 'claude-3-opus-20240229', 'Anthropic model to use')
ON CONFLICT (setting_key) DO NOTHING;

