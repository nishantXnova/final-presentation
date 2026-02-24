-- =============================================
-- STORAGE BUCKET FOR PLACE IMAGES
-- =============================================

-- Create storage bucket for place images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'place-images',
  'place-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS Policies for storage

-- Anyone can view place images (public bucket)
CREATE POLICY "Public can view place images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'place-images');

-- Only admins can upload place images
CREATE POLICY "Admins can upload place images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'place-images' 
  AND public.is_admin(auth.uid())
);

-- Only admins can update place images
CREATE POLICY "Admins can update place images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'place-images' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'place-images' AND public.is_admin(auth.uid()));

-- Only admins can delete place images
CREATE POLICY "Admins can delete place images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'place-images' AND public.is_admin(auth.uid()));