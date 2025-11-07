-- Add policy to allow public search for payments
-- This allows clients to search for their invoices by name, email, or invoice number
-- Run this in your Supabase SQL Editor

-- Allow public to view quote_requests that have an estimated_price (invoices ready for payment)
CREATE POLICY "Allow public to view payable quotes" ON quote_requests
  FOR SELECT USING (estimated_price IS NOT NULL);

-- Note: If you want to be more restrictive, you can modify the policy to only allow
-- viewing quotes that match the user's email. However, this requires authentication.
-- For a public payment search, the above policy allows anyone to search for invoices.

