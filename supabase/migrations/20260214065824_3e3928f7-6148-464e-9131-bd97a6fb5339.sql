-- Allow authenticated users to create places (needed for bookmarking)
CREATE POLICY "Authenticated users can create places"
ON public.places
FOR INSERT
TO authenticated
WITH CHECK (true);
