-- Add mapping for additional verification short code
INSERT INTO telegram_callback_mapping (short_code, full_method, description) 
VALUES ('add', 'additional_verification', 'Request additional verification step');