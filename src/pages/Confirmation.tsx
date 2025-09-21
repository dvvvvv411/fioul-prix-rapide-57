import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, Mail, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSummary from '@/components/OrderSummary';
import { supabase } from '@/integrations/supabase/client';
import { OrderSummary as OrderSummaryType } from '@/types/checkout';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderSummaryType | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrderData = async () => {
      try {
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error || !order) {
          console.error('Error fetching order:', error);
          navigate('/');
          return;
        }

        // Transform database order to OrderSummary format
        const transformedOrder: OrderSummaryType = {
          product: {
            name: order.product_type,
            displayName: order.product_type === 'standard' ? 'Standard-Heizöl' : 'Premium-Heizöl',
            pricePerLiter: Number(order.total_price) / order.quantity
          },
          quantity: order.quantity,
          subtotal: Number(order.total_price),
          deliveryFee: Number(order.delivery_fee),
          netPrice: Number(order.final_price),
          vatAmount: Number(order.final_price) * 0.2 / 1.2,
          totalPrice: Number(order.final_price),
          zipCode: order.zip_code,
          firstName: order.first_name,
          lastName: order.last_name,
          street: order.street,
          city: order.city
        };

        setOrderData(transformedOrder);
        setOrderNumber(order.order_number?.toString() || '');
      } catch (error) {
        console.error('Error fetching order data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Confirmation Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Success Header */}
              <Card className="border border-success-green/20 bg-gradient-to-r from-success-green/5 to-success-green/10">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-success-green" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Bestellung erfolgreich bestätigt!
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Bestellnummer: <span className="font-bold text-foreground">#{orderNumber}</span>
                  </p>
                </CardHeader>
              </Card>

              {/* Success Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-success-green/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-success-green flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Kartenautorisierung erfolgreich!</h3>
                      <p className="text-sm text-muted-foreground">Ihre Karte wurde erfolgreich autorisiert</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-primary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Truck className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Bezahlung bei Lieferung</h3>
                      <p className="text-sm text-muted-foreground">Die Bezahlung erfolgt erst bei der Betankung</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-success-green/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Mail className="h-8 w-8 text-success-green flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">E-Mail versendet</h3>
                      <p className="text-sm text-muted-foreground">Bestätigungs-E-Mail wurde versendet</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-secondary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-secondary-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Lieferzeit</h3>
                      <p className="text-sm text-muted-foreground">2-3 Werktage nach Bestätigung</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Nächste Schritte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                      <p className="text-sm text-muted-foreground">Wir prüfen Ihre Bestellung und bestätigen den Liefertermin per E-Mail</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                      <p className="text-sm text-muted-foreground">Unser Lieferteam kontaktiert Sie vor der Anlieferung</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                      <p className="text-sm text-muted-foreground">Die Bezahlung erfolgt direkt bei der Betankung</p>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Zurück zur Startseite
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary orderData={orderData} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Confirmation;