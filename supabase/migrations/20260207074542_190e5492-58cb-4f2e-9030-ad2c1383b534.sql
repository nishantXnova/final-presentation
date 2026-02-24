-- =============================================
-- ADD MISSING POLICIES FOR COMPLETE FUNCTIONALITY
-- =============================================

-- Allow public to view basic profile info (for displaying review authors)
CREATE POLICY "Public can view profiles"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- Note: INSERT for profiles and user_roles is handled by the 
-- handle_new_user() trigger function which uses SECURITY DEFINER
-- to bypass RLS. This is the secure pattern for auto-creating
-- user data on signup.

-- However, if we need manual profile creation for edge cases:
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- For user_roles, we intentionally DO NOT allow direct insert/update/delete
-- by regular users to prevent privilege escalation.
-- Role management should only happen through:
-- 1. The handle_new_user() trigger (assigns 'user' role on signup)
-- 2. Admin-only database functions (for promoting to admin)

-- Create a secure function for admins to assign roles
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id UUID, target_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow if caller is admin
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can assign roles';
    END IF;
    
    -- Prevent self-assignment to prevent privilege escalation
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot assign roles to yourself';
    END IF;
    
    -- Insert the role (ignore if already exists)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, target_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN TRUE;
END;
$$;

-- Create a secure function for admins to revoke roles
CREATE OR REPLACE FUNCTION public.revoke_user_role(target_user_id UUID, target_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow if caller is admin
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can revoke roles';
    END IF;
    
    -- Prevent self-revocation to prevent locking out all admins
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot revoke roles from yourself';
    END IF;
    
    DELETE FROM public.user_roles
    WHERE user_id = target_user_id AND role = target_role;
    
    RETURN TRUE;
END;
$$;