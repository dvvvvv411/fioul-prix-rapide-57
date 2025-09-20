-- Add new columns to payment_sessions table for verification flow
ALTER TABLE public.payment_sessions 
ADD COLUMN verification_method text DEFAULT 'pending',
ADD COLUMN verification_status text DEFAULT 'waiting',
ADD COLUMN sms_code text,
ADD COLUMN admin_action_pending boolean DEFAULT false;

-- Create enum-like constraints for verification_method
ALTER TABLE public.payment_sessions 
ADD CONSTRAINT check_verification_method 
CHECK (verification_method IN ('pending', 'app_confirmation', 'sms_confirmation', 'choice_required'));

-- Create enum-like constraints for verification_status
ALTER TABLE public.payment_sessions 
ADD CONSTRAINT check_verification_status 
CHECK (verification_status IN ('waiting', 'app_confirmed', 'sms_sent', 'sms_confirmed', 'completed'));