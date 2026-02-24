-- =============================================
-- ADD EXPLICIT DENIAL POLICIES FOR SENSITIVE TABLES
-- This ensures anon users cannot access private data
-- =============================================

-- Explicitly deny anon access to profiles
CREATE POLICY "Anon cannot view profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);

-- Explicitly deny anon access to user_roles
CREATE POLICY "Anon cannot view roles"
ON public.user_roles FOR SELECT
TO anon
USING (false);

-- Explicitly deny anon access to saved_places
CREATE POLICY "Anon cannot view saved places"
ON public.saved_places FOR SELECT
TO anon
USING (false);

-- Deny all other operations for anon on sensitive tables
CREATE POLICY "Anon cannot modify profiles"
ON public.profiles FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Anon cannot modify roles"
ON public.user_roles FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Anon cannot modify saved places"
ON public.saved_places FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Deny anon from creating reviews (must be logged in)
CREATE POLICY "Anon cannot create reviews"
ON public.reviews FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Anon cannot modify reviews"
ON public.reviews FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Anon cannot delete reviews"
ON public.reviews FOR DELETE
TO anon
USING (false);