-- =============================================
-- FIX RLS POLICIES - Convert RESTRICTIVE to PERMISSIVE
-- The policies were created as RESTRICTIVE by default
-- We need to recreate them as PERMISSIVE (standard behavior)
-- =============================================

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop existing policies for user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Drop existing policies for places
DROP POLICY IF EXISTS "Anyone can view places" ON public.places;
DROP POLICY IF EXISTS "Admins can create places" ON public.places;
DROP POLICY IF EXISTS "Admins can update places" ON public.places;
DROP POLICY IF EXISTS "Admins can delete places" ON public.places;

-- Drop existing policies for reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

-- Drop existing policies for saved_places
DROP POLICY IF EXISTS "Users can view own saved places" ON public.saved_places;
DROP POLICY IF EXISTS "Users can save places" ON public.saved_places;
DROP POLICY IF EXISTS "Users can remove saved places" ON public.saved_places;

-- =============================================
-- RECREATE POLICIES AS PERMISSIVE (default)
-- =============================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- USER ROLES POLICIES (more restrictive for security)
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- PLACES POLICIES
CREATE POLICY "Anyone can view places"
ON public.places FOR SELECT
TO authenticated
USING (true);

-- Allow anon users to view places too (public content)
CREATE POLICY "Public can view places"
ON public.places FOR SELECT
TO anon
USING (true);

CREATE POLICY "Admins can create places"
ON public.places FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update places"
ON public.places FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete places"
ON public.places FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Public can view reviews"
ON public.reviews FOR SELECT
TO anon
USING (true);

CREATE POLICY "Users can create own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- SAVED PLACES POLICIES
CREATE POLICY "Users can view own saved places"
ON public.saved_places FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can save places"
ON public.saved_places FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove saved places"
ON public.saved_places FOR DELETE
TO authenticated
USING (user_id = auth.uid());