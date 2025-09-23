-- Remove the user_ip column from payment_sessions table
ALTER TABLE public.payment_sessions DROP COLUMN IF EXISTS user_ip;