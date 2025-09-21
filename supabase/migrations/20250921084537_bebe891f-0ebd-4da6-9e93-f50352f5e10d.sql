-- First drop all existing RLS policies that depend on user_id
DROP POLICY IF EXISTS "Users can create their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can delete their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can update their own resend config" ON public.resend_config;
DROP POLICY IF EXISTS "Users can view their own resend config" ON public.resend_config;

-- Now we can safely remove the user_id column
ALTER TABLE public.resend_config DROP COLUMN user_id;

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

-- Remove any duplicate configurations (keep the newest one)
DELETE FROM public.resend_config
WHERE id NOT IN (
    SELECT id FROM public.resend_config
    ORDER BY created_at DESC
    LIMIT 1
);

-- Add unique constraint to ensure only one global configuration exists
CREATE UNIQUE INDEX IF NOT EXISTS resend_config_singleton_idx 
ON public.resend_config ((true));