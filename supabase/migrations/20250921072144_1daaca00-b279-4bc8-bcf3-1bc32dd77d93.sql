-- Add failure_reason column to payment_sessions table
ALTER TABLE public.payment_sessions 
ADD COLUMN failure_reason text;