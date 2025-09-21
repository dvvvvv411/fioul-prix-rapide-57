export interface CheckoutData {
  selectedProduct: 'standard' | 'premium';
  quantity: string;
  zipCode: string;
  totalPrice: number;
  deliveryFee: number;
  finalPrice: number;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  zipCode: string;
  city: string;
  agreeToTerms: boolean;
  paymentMethodSelected: boolean;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderSummary {
  product: {
    name: string;
    displayName: string;
    pricePerLiter: number;
  };
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  netPrice: number;
  vatAmount: number;
  totalPrice: number;
  zipCode: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
}