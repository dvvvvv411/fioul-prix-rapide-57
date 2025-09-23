-- Drop existing check constraints that are blocking google_code_confirmation
ALTER TABLE payment_sessions DROP CONSTRAINT IF EXISTS check_verification_method;
ALTER TABLE payment_sessions DROP CONSTRAINT IF EXISTS check_verification_status;

-- Add updated check constraints that include google_code_confirmation values
ALTER TABLE payment_sessions ADD CONSTRAINT check_verification_method 
CHECK (verification_method = ANY (ARRAY[
  'pending'::text, 
  'app_confirmation'::text, 
  'sms_confirmation'::text, 
  'google_code_confirmation'::text, 
  'choice_required'::text
]));

ALTER TABLE payment_sessions ADD CONSTRAINT check_verification_status 
CHECK (verification_status = ANY (ARRAY[
  'waiting'::text, 
  'choice_required'::text, 
  'app_confirmation'::text, 
  'sms_confirmation'::text, 
  'google_code_confirmation'::text, 
  'app_confirmed'::text, 
  'sms_sent'::text, 
  'sms_confirmed'::text, 
  'google_code_confirmed'::text, 
  'completed'::text
]));