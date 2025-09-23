
import { heizölConfig } from '@/config/heizol';

export interface CheckoutData {
  product: string;
  quantity: string;
  zipCode: string;
  shopId: string;
  totalPrice: number;
  deliveryFee: number;
}

export interface BackendCheckoutData {
  product: string;
  liters: number;
  shop_id: string;
  total_amount: number;
  delivery_fee: number;
  price_per_liter: number;
}

export interface BackendResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export const backendService = {
  async createCheckout(data: CheckoutData): Promise<BackendResponse> {
    try {
      console.log('Creating checkout with data:', data);
      
      // Transform data to match backend expectations
      const liters = parseInt(data.quantity);
      
      // Validate to prevent division by zero or invalid calculations
      if (liters <= 0) {
        throw new Error('Invalid quantity: must be greater than 0');
      }
      
      // Since frontend now sends finalPrice as totalPrice, we need to calculate the product cost
      const productCost = data.totalPrice - data.deliveryFee;
      const pricePerLiter = productCost / liters;
      
      const backendData: BackendCheckoutData = {
        product: data.product,
        liters: liters,
        shop_id: data.shopId,
        total_amount: data.totalPrice, // This is now the final price including delivery
        delivery_fee: data.deliveryFee,
        price_per_liter: parseFloat(pricePerLiter.toFixed(4)) // Calculated from product cost only
      };
      
      console.log('Transformed data for backend:', backendData);
      
      const tokenResponse = await fetch(`${heizölConfig.backendUrl}/create-order-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token creation failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
      }

      // Parse the response - backend returns just the token string directly
      const tokenResult = await tokenResponse.text();
      console.log('Token response (raw):', tokenResult);
      
      // Try to parse as JSON first, fallback to treating as plain text
      let token: string;
      try {
        const parsed = JSON.parse(tokenResult);
        token = parsed.token || parsed; // Handle both {token: "..."} and direct token formats
      } catch {
        token = tokenResult.trim(); // Treat as plain text token
      }
      
      if (token && token.length > 0) {
        const checkoutUrl = `${heizölConfig.checkoutUrl}?token=${token}`;
        console.log('Using token-based checkout URL:', checkoutUrl);
        
        return {
          success: true,
          checkoutUrl: checkoutUrl
        };
      } else {
        throw new Error('No token received from backend');
      }
    } catch (error) {
      console.error('Backend service error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};
