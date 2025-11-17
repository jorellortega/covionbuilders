-- Create the service_pages table to store content for individual service pages
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS service_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- e.g., 'general-labor', 'concrete', 'painting'
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  video_url TEXT, -- YouTube or other video embed URL
  services_section_title TEXT,
  services_content JSONB, -- Flexible JSON structure for services lists
  why_choose_title TEXT,
  why_choose_content JSONB, -- Flexible JSON structure for why choose us items
  cta_title TEXT,
  cta_description TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_service_pages_slug ON service_pages(slug);

-- Create an index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_service_pages_is_active ON service_pages(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE service_pages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access
CREATE POLICY "Allow public read on service_pages" ON service_pages
  FOR SELECT USING (is_active = true);

-- Create a policy that allows authenticated users with CEO role to manage service pages
CREATE POLICY "Allow CEO to manage service_pages" ON service_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ceo'
    )
  );

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_service_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_pages_updated_at
  BEFORE UPDATE ON service_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_service_pages_updated_at();

-- Insert initial data for existing service pages
INSERT INTO service_pages (slug, title, subtitle, services_section_title, why_choose_title, cta_title, cta_description) VALUES
  ('general-labor', 'Professional General Labor Services', 'Skilled and general labor for construction, site preparation, and support tasks. Our team ensures your project runs smoothly from start to finish.', 'Our General Labor Services', 'Why Choose Our General Labor Services', 'Need Reliable Labor Support?', 'Contact us today to discuss your project requirements'),
  ('concrete', 'Professional Concrete Solutions', 'Expert concrete work for foundations, driveways, sidewalks, retaining walls, and more. Our skilled team delivers durable, high-quality results for every project.', 'Our Concrete Services', 'Why Choose Our Concrete Services', 'Ready to Start Your Project?', 'Contact us today for a free consultation and estimate'),
  ('painting', 'Professional Painting Services', 'Expert interior and exterior painting services for residential and commercial properties. Quality finishes that enhance and protect your property.', 'Our Painting Services', 'Why Choose Our Painting Services', 'Ready to Transform Your Space?', 'Contact us today for a free consultation and estimate'),
  ('roofing', 'Professional Roofing Services', 'Expert roofing solutions for residential and commercial properties. Quality materials and expert installation for lasting protection.', 'Our Roofing Services', 'Why Choose Our Roofing Services', 'Need Roofing Solutions?', 'Contact us today for a free consultation and estimate'),
  ('remodeling', 'Professional Remodeling Services', 'Transform your space with our expert remodeling services. From kitchens to bathrooms, we bring your vision to life.', 'Our Remodeling Services', 'Why Choose Our Remodeling Services', 'Ready to Remodel?', 'Contact us today for a free consultation and estimate'),
  ('landscaping', 'Professional Landscaping Services', 'Create beautiful outdoor spaces with our expert landscaping services. Design, installation, and maintenance for stunning results.', 'Our Landscaping Services', 'Why Choose Our Landscaping Services', 'Ready to Enhance Your Outdoor Space?', 'Contact us today for a free consultation and estimate'),
  ('residential-development', 'Professional Residential Development', 'Complete residential development services from planning to completion. Quality homes built with expertise and care.', 'Our Residential Development Services', 'Why Choose Our Residential Development Services', 'Ready to Build Your Dream Home?', 'Contact us today for a free consultation and estimate')
ON CONFLICT (slug) DO NOTHING;

