-- Add files field to quote_requests table
-- Run this in your Supabase SQL Editor

-- Add files column to store uploaded file URLs
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS files TEXT[] DEFAULT '{}';

-- Update existing records to have empty files array
UPDATE quote_requests 
SET files = '{}' 
WHERE files IS NULL;
