
-- Create a storage bucket for business card assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-card-assets', 'Business Card Assets', true);

-- Enable RLS for the new bucket
CREATE POLICY "Public access for business card assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-card-assets');

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-card-assets' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own files
CREATE POLICY "Allow users to update their own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-card-assets' 
    AND auth.uid() = owner
  );

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-card-assets' 
    AND auth.uid() = owner
  );
