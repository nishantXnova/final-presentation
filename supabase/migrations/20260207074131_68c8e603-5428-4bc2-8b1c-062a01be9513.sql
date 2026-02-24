-- =============================================
-- SECURE TRAVEL APP DATABASE SCHEMA
-- =============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create user_roles table (SEPARATE from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 4. Create places table
CREATE TABLE public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    image_url TEXT,
    category TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 5. Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, place_id)
);

-- 6. Create saved_places table (bookmarks)
CREATE TABLE public.saved_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, place_id)
);

-- =============================================
-- SECURITY DEFINER FUNCTIONS (bypass RLS safely)
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- Get current user's ID safely
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT auth.uid()
$$;

-- =============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- =============================================
-- RLS POLICIES - USER ROLES (CRITICAL SECURITY)
-- =============================================

-- Users can only view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- No direct insert/update/delete - must go through secure functions
-- This prevents privilege escalation

-- =============================================
-- RLS POLICIES - PLACES
-- =============================================

-- Everyone can view places (public data)
CREATE POLICY "Anyone can view places"
ON public.places FOR SELECT
TO authenticated
USING (true);

-- Only admins can create places
CREATE POLICY "Admins can create places"
ON public.places FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update places
CREATE POLICY "Admins can update places"
ON public.places FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete places
CREATE POLICY "Admins can delete places"
ON public.places FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - REVIEWS
-- =============================================

-- Everyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =============================================
-- RLS POLICIES - SAVED PLACES
-- =============================================

-- Users can only view their own saved places
CREATE POLICY "Users can view own saved places"
ON public.saved_places FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can save places for themselves
CREATE POLICY "Users can save places"
ON public.saved_places FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can remove their own saved places
CREATE POLICY "Users can remove saved places"
ON public.saved_places FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =============================================
-- TRIGGERS FOR AUTO-UPDATES
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-update timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON public.places
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE & ROLE ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Trigger to auto-create profile and role on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SECURE FUNCTION TO UPDATE PLACE RATINGS
-- =============================================

CREATE OR REPLACE FUNCTION public.update_place_rating()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.places
    SET rating = (
        SELECT COALESCE(AVG(rating)::DECIMAL(2,1), 0)
        FROM public.reviews
        WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)
    )
    WHERE id = COALESCE(NEW.place_id, OLD.place_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_place_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_place_rating();