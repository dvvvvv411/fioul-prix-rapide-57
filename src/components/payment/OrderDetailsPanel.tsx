import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Truck, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { heizölConfig } from '@/config/heizol';

interface OrderDetailsPanelProps {
  orderId: string;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ orderId }) => {
  // Mock order data - in real app this would come from API
  const orderData = {
    product: heizölConfig.products.standard,
    quantity: 2000,
    subtotal: 1400,
    deliveryFee: 0,
    vatAmount: 266,
    totalPrice: 1666,
    zipCode: "10115",
    deliveryAddress: "Musterstraße 123, 10115 Berlin"
  };

  return (
    <div className="space-y-6">
      {/* Total Fioul Header */}
      <div className="text-center space-y-4">
        <img 
          src="https://i.imgur.com/NqMqAH6.png" 
          alt="Total Fioul Logo" 
          className="h-12 mx-auto"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Total Fioul France
          </h2>
          <p className="text-sm text-gray-600">
            Partout en France
          </p>
        </div>
      </div>

      {/* Important Payment Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-900 mb-1">
                Zahlung bei Lieferung
              </h3>
              <p className="text-sm text-orange-800">
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
                  {orderData.product.displayName}
                </h4>
                <p className="text-sm text-gray-600">
                  {orderData.quantity.toLocaleString()} Liter
                </p>
                <p className="text-xs text-gray-500">
                  €{orderData.product.pricePerLiter.toFixed(2)} pro Liter
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  €{orderData.subtotal.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Zwischensumme</span>
                <span>€{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lieferung</span>
                <span className="text-green-600 font-medium">Kostenlos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MwSt. (19%)</span>
                <span>€{orderData.vatAmount}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Gesamtsumme</span>
                <span>€{orderData.totalPrice.toLocaleString()}</span>
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
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Lieferadresse</p>
              <p className="text-sm text-gray-600">{orderData.deliveryAddress}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Lieferzeit</p>
              <p className="text-sm text-gray-600">1-2 Werktage nach Bestellung</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Unternehmensinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">info@total-fioul.fr</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Service-Hotline verfügbar</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-gray-600">
                <p>Total Fioul France</p>
                <p>Lieferservice für ganz Frankreich</p>
              </div>
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