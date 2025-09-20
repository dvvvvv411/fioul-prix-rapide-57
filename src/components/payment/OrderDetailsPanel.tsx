import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { heizölConfig } from '@/config/heizol';
import { calculateFrenchPricing } from '@/utils/pricing';

interface OrderDetailsPanelProps {
  orderId: string;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ orderId }) => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      setOrderData(data);
    };
    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const productConfig = orderData.product_type === 'premium' 
    ? heizölConfig.products.premium 
    : heizölConfig.products.standard;

  // Calculate French pricing with VAT
  const totalPricing = calculateFrenchPricing(parseFloat(orderData.total_price));
  const deliveryPricing = orderData.delivery_fee > 0 ? calculateFrenchPricing(parseFloat(orderData.delivery_fee)) : null;
  const finalPricing = calculateFrenchPricing(parseFloat(orderData.final_price));

  return (
    <div className="space-y-6">
      {/* Important Payment Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-green-900 mb-1">
                Zahlung bei Lieferung
              </h3>
              <p className="text-sm text-green-800">
                Die Zahlung erfolgt erst nach der Lieferung. Ihre Karte wird nur zur Sicherheit autorisiert.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Bestellübersicht</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {productConfig.displayName}
                </h4>
                <p className="text-sm text-gray-600">
                  {orderData.quantity.toLocaleString()} Liter
                </p>
                <p className="text-xs text-gray-500">
                  €{productConfig.pricePerLiter.toFixed(2)} pro Liter
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  €{orderData.total_price}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Netto-Preis (HT)</span>
                <span>€{totalPricing.netPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lieferung</span>
                <span className="text-green-600 font-medium">
                  {orderData.delivery_fee > 0 ? `€${orderData.delivery_fee}` : 'Kostenlos'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MwSt. (20%)</span>
                <span>€{finalPricing.vatAmount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Gesamtsumme (TTC)</span>
                <span>€{orderData.final_price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Lieferinformationen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left side - Delivery Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lieferadresse</p>
                  <p className="text-sm text-gray-600">
                    {orderData.first_name} {orderData.last_name}<br />
                    {orderData.street}<br />
                    {orderData.zip_code} {orderData.city}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lieferzeit</p>
                  <p className="text-sm text-gray-600">2-3 Werktage nach Bestellung</p>
                </div>
              </div>
            </div>

            {/* Right side - Company Logo */}
            <div className="flex flex-col items-center justify-center">
              <img 
                src="https://i.imgur.com/NqMqAH6.png" 
                alt="Total Fioul Logo" 
                className="h-16"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order ID */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          Bestell-ID: <span className="font-mono">{orderId}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;