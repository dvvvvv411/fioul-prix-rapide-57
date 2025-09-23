-- Create telegram callback mapping table
CREATE TABLE public.telegram_callback_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code TEXT UNIQUE NOT NULL,
  full_method TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_callback_mapping ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (needed for telegram bot)
CREATE POLICY "Allow public read access to telegram callback mapping" 
ON public.telegram_callback_mapping 
FOR SELECT 
USING (true);

-- Insert standard mappings
INSERT INTO public.telegram_callback_mapping (short_code, full_method, description) VALUES
('gc', 'google_code_confirmation', 'Google Code Verification'),
('sms', 'sms_confirmation', 'SMS Verification'),
('app', 'app_confirmation', 'App Verification'),
('choice', 'choice_required', 'Choice Required');