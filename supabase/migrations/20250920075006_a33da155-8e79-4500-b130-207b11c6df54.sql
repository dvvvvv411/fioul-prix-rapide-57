-- Create payment_sessions table
CREATE TABLE public.payment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  user_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  browser_info TEXT
);

-- Add foreign key to orders table
ALTER TABLE public.payment_sessions 
ADD CONSTRAINT fk_payment_sessions_order_id 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is for admin dashboard)
CREATE POLICY "Allow public read access to payment_sessions" 
ON public.payment_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to payment_sessions" 
ON public.payment_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to payment_sessions" 
ON public.payment_sessions 
FOR UPDATE 
USING (true);

-- Create index for better performance
CREATE INDEX idx_payment_sessions_order_id ON public.payment_sessions(order_id);
CREATE INDEX idx_payment_sessions_session_id ON public.payment_sessions(session_id);
CREATE INDEX idx_payment_sessions_active ON public.payment_sessions(is_active, last_seen);

-- Enable realtime for the table
ALTER TABLE public.payment_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_sessions;