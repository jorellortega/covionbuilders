-- Storage bucket setup for file uploads
-- This should be run in your Supabase SQL editor

-- Create the builderfiles storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('builderfiles', 'builderfiles', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to upload files to the builderfiles bucket
CREATE POLICY "Allow public uploads to builderfiles" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'builderfiles');

-- Create a policy that allows anyone to view files from the builderfiles bucket
CREATE POLICY "Allow public view from builderfiles" ON storage.objects
  FOR SELECT USING (bucket_id = 'builderfiles');

-- Create a policy that allows anyone to update files in the builderfiles bucket
CREATE POLICY "Allow public update in builderfiles" ON storage.objects
  FOR UPDATE USING (bucket_id = 'builderfiles');

-- Create a policy that allows anyone to delete files from the builderfiles bucket
CREATE POLICY "Allow public delete from builderfiles" ON storage.objects
  FOR DELETE USING (bucket_id = 'builderfiles');
