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

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error('Ungültige Bestelldaten. Bitte starten Sie erneut vom Preisrechner.');
      navigate('/');
      return;
    }

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

  const handleSubmit = async (customerInfo: CustomerInfo) => {
    if (!checkoutData) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with your payment processor
      // For now, we'll show a success message
      toast.success('Bestellung erfolgreich übermittelt!', {
        description: 'Sie erhalten in Kürze eine Bestätigungs-E-Mail.'
      });
      
      // Redirect to success page or home
      navigate('/', { 
        state: { 
          orderSuccess: true,
          orderData: { ...checkoutData, customerInfo }
        }
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Fehler bei der Bestellung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCalculator = () => {
    navigate('/');
  };

  if (!checkoutData || !orderSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Bestelldaten werden geladen...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToCalculator}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Preisrechner
          </Button>
        </div>

        {/* Page Title */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Vervollständigen Sie Ihre Bestellung für {orderSummary.quantity.toLocaleString()}L {orderSummary.product.displayName}
          </p>
        </div>

        {/* Checkout Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Checkout Form (2/3 width) */}
            <div className="lg:col-span-2">
              <CheckoutForm
                initialZipCode={checkoutData.zipCode}
                totalPrice={checkoutData.finalPrice}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right Side - Order Summary (1/3 width) */}
            <div className="lg:col-span-1">
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