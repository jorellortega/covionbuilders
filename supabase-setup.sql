-- Create the quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_type TEXT NOT NULL,
  project_size TEXT,
  project_location TEXT NOT NULL,
  project_timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  company TEXT,
  services TEXT[] NOT NULL,
  additional_comments TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert quote requests
CREATE POLICY "Allow public insert on quote_requests" ON quote_requests
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows authenticated users to view quote requests
-- You can modify this based on your authentication requirements
CREATE POLICY "Allow authenticated users to view quote_requests" ON quote_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_quote_requests_updated_at 
    BEFORE UPDATE ON quote_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 