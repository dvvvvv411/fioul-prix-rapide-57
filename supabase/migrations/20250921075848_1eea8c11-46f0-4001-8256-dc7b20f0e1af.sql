-- Create resend_config table for storing email configuration
CREATE TABLE public.resend_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resend_config ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own resend config" 
ON public.resend_config 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resend config" 
ON public.resend_config 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resend config" 
ON public.resend_config 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resend config" 
ON public.resend_config 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_resend_config_updated_at
BEFORE UPDATE ON public.resend_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();