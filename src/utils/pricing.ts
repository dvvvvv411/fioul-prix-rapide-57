// French VAT rate: 20%
const FRENCH_VAT_RATE = 0.20;

export const calculateFrenchPricing = (grossPrice: number) => {
  // Convert gross price (TTC) to net price (HT)
  const netPrice = grossPrice / (1 + FRENCH_VAT_RATE);
  const vatAmount = grossPrice - netPrice;
  
  return {
    netPrice: Math.round(netPrice * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossPrice: Math.round(grossPrice * 100) / 100,
    vatRate: FRENCH_VAT_RATE
  };
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatCurrency = (price: number): string => {
  return `${formatPrice(price)}€`;
};