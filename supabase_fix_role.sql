-- Add the 'role' column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'Tourist';

-- Add the check constraint to ensure only valid roles are used
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_role_check CHECK (role IN ('Tourist', 'Guide'));
    END IF;
END $$;
