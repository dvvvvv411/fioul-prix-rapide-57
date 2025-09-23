
export const heizölConfig = {
  shopId: "93ea80da-40c2-492a-98c5-c38bfef5570c",
  backendUrl: "https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1",
  checkoutUrl: "https://checkout.total-fioul.fr/checkout",
  products: {
    standard: {
      name: "standard_heizoel",
      displayName: "Fioul Standard",
      pricePerLiter: 0.70,
    },
    premium: {
      name: "premium_heizoel", 
      displayName: "Fioul Premium",
      pricePerLiter: 0.73,
    }
  },
  delivery: {
    freeDeliveryThreshold: 2000,
    deliveryFee: 39
  },
  limits: {
    minLiters: 1500,
    maxLiters: 20000
  }
};
