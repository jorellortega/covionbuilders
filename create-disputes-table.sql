-- Create the disputes table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('dispute', 'update')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES quote_requests(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  description TEXT NOT NULL,
  category TEXT,
  files TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_disputes_user_id ON disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_type ON disputes(type);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert disputes
CREATE POLICY "Allow public insert on disputes" ON disputes
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows authenticated users to view their own disputes
CREATE POLICY "Allow users to view own disputes" ON disputes
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows authenticated admin users to view all disputes
CREATE POLICY "Allow authenticated users to view all disputes" ON disputes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_disputes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_disputes_updated_at 
    BEFORE UPDATE ON disputes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_disputes_updated_at();

