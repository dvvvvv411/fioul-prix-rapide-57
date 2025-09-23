import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckoutData, CustomerInfo, OrderSummary as OrderSummaryType } from '@/types/checkout';
import { heizölConfig } from '@/config/heizol';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryType | null>(null);
  

  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Extract data from URL parameters
    const selectedProduct = searchParams.get('product') as 'standard' | 'premium' || 'premium';
    const quantity = searchParams.get('quantity') || '3000';
    const zipCode = searchParams.get('zipCode') || '';
    const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
    const deliveryFee = parseFloat(searchParams.get('deliveryFee') || '0');
    const finalPrice = parseFloat(searchParams.get('finalPrice') || '0');

    // Validate required parameters
    if (!zipCode || totalPrice === 0) {
      toast.error('Données de commande invalides. Veuillez recommencer depuis le calculateur de prix.');
      navigate('/');
      return;
    }

    // Send Telegram notification when checkout page is accessed
    const sendCheckoutNotification = async () => {
      try {
        const product = heizölConfig.products[selectedProduct];
        await supabase.functions.invoke('telegram-bot', {
          body: {
            type: 'checkout_started',
            data: {
              product: {
                name: product.name,
                displayName: product.displayName
              },
              quantity: parseInt(quantity),
              zipCode,
              totalPrice: finalPrice
            }
          }
        });
      } catch (error) {
        console.error('Failed to send checkout notification:', error);
      }
    };

    sendCheckoutNotification();

    const data: CheckoutData = {
      selectedProduct,
      quantity,
      zipCode,
      totalPrice,
      deliveryFee,
      finalPrice
    };

    setCheckoutData(data);

    // Create order summary
    const product = heizölConfig.products[selectedProduct];
    const quantityNumber = parseInt(quantity);
    
    const summary: OrderSummaryType = {
      product: {
        name: product.name,
        displayName: product.displayName,
        pricePerLiter: product.pricePerLiter
      },
      quantity: quantityNumber,
      subtotal: totalPrice,
      deliveryFee: deliveryFee,
      netPrice: totalPrice,
      vatAmount: 0, // Will be calculated in component
      totalPrice: finalPrice,
      zipCode: zipCode
    };

    setOrderSummary(summary);
  }, [searchParams, navigate]);


  const handleBackToCalculator = () => {
    navigate('/');
  };

  if (!checkoutData || !orderSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des données de commande...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToCalculator}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au calculateur de prix
          </Button>
        </div>

        {/* Page Title */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finaliser la commande</h1>
          <p className="text-muted-foreground">
            Finalisez votre commande pour {orderSummary.quantity.toLocaleString()}L {orderSummary.product.displayName}
          </p>
        </div>

        {/* Checkout Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Checkout Form (2/3 width) */}
            <div className="lg:col-span-2 order-2 lg:order-1">
            <CheckoutForm 
              initialZipCode={checkoutData.zipCode}
              totalPrice={checkoutData.finalPrice}
              checkoutData={checkoutData}
            />
            </div>

            {/* Right Side - Order Summary (1/3 width) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <OrderSummary orderData={orderSummary} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;