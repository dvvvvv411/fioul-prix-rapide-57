-- Remove user_id column from resend_config table to make it global
ALTER TABLE public.resend_config DROP COLUMN user_id;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can create their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can delete their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can update their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can view their own resend config" ON public.resend_config;

-- Create new RLS policies for global configuration
-- Allow public read access for edge functions (anonymous users)
CREATE POLICY "Allow public read access to resend config" 
ON public.resend_config 
FOR SELECT 
USING (true);

-- Only authenticated users can manage the configuration
CREATE POLICY "Authenticated users can create resend config" 
ON public.resend_config 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update resend config" 
ON public.resend_config 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete resend config" 
ON public.resend_config 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add constraint to ensure only one global configuration exists
-- First, remove any duplicate configurations (keep the newest one)
DELETE FROM public.resend_config
WHERE id NOT IN (
    SELECT id FROM public.resend_config
    ORDER BY created_at DESC
    LIMIT 1
);

-- Add unique constraint to prevent multiple configurations
CREATE UNIQUE INDEX IF NOT EXISTS resend_config_singleton_idx 
ON public.resend_config ((true));