-- Add google_code column to payment_sessions table for the new Google-Code verification scenario
ALTER TABLE public.payment_sessions ADD COLUMN google_code text;