-- Migration: Add get_ai_settings() function for API access
-- Run this ONLY if you've already run create-ai-settings-table.sql
-- This allows the AI chat API to securely access settings

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

