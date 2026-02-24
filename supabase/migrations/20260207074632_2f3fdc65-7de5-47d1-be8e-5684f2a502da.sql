-- =============================================
-- CLEAN UP DUPLICATE AND CONFLICTING POLICIES
-- =============================================

-- Remove duplicate/conflicting profile policies
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

-- Remove duplicate place policies (keep the authenticated one)
DROP POLICY IF EXISTS "Public can view places" ON public.places;

-- Remove duplicate review policies (keep the authenticated one)  
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;

-- Re-add anon policies that are actually needed (for public viewing without login)
-- But we need to be more careful - anon should see places/reviews but not profiles

-- Allow anon to view places (public content)
CREATE POLICY "Anon can view places"
ON public.places FOR SELECT
TO anon
USING (true);

-- Allow anon to view reviews (public content)
CREATE POLICY "Anon can view reviews"
ON public.reviews FOR SELECT
TO anon
USING (true);