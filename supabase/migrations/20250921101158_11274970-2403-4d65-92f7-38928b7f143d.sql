-- Create telegram_config table for managing bot settings and chat IDs
CREATE TABLE public.telegram_config (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id TEXT NOT NULL UNIQUE,
    chat_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_config ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users only
CREATE POLICY "Authenticated users can view telegram config" 
ON public.telegram_config 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create telegram config" 
ON public.telegram_config 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update telegram config" 
ON public.telegram_config 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete telegram config" 
ON public.telegram_config 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_telegram_config_updated_at
BEFORE UPDATE ON public.telegram_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();