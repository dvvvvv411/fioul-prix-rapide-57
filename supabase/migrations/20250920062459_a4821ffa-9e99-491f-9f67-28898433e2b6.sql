-- Create orders table to store checkout data
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Produktdaten
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  zip_code TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2) NOT NULL,
  
  -- Kundendaten
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  
  -- Kreditkartendaten (als TEXT unverschlüsselt für Testzwecke)
  payment_method_selected BOOLEAN DEFAULT FALSE,
  cardholder_name TEXT,
  card_number TEXT,
  expiry_date TEXT,
  cvv TEXT,
  
  -- Zusatzfelder
  terms_agreed BOOLEAN DEFAULT FALSE,
  order_status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (für Testzwecke)
CREATE POLICY "Allow public read access to orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;