-- Fix security warnings by setting search_path for functions

-- Update generate_order_number function with proper search_path
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS bigint AS $$
DECLARE
    new_number bigint;
    counter integer := 0;
BEGIN
    LOOP
        -- Generate 8-digit random number (10000000 to 99999999)
        new_number := (random() * 90000000)::bigint + 10000000;
        
        -- Check if number already exists
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_number) THEN
            EXIT;
        END IF;
        
        -- Prevent infinite loop
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique order number after 100 attempts';
        END IF;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update set_order_number function with proper search_path
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;