import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderSummary as OrderSummaryType } from '@/types/checkout';
import { calculateFrenchPricing, formatCurrency } from '@/utils/pricing';
import { Package, MapPin, Truck, Clock } from 'lucide-react';

interface OrderSummaryProps {
  orderData: OrderSummaryType;
}

const OrderSummary = ({ orderData }: OrderSummaryProps) => {
  const { netPrice, vatAmount, grossPrice } = calculateFrenchPricing(orderData.totalPrice);
  const deliveryPricing = orderData.deliveryFee > 0 ? calculateFrenchPricing(orderData.deliveryFee) : null;

  return (
    <div className="sticky top-4">
      <Card className="shadow-lg border border-border">
        <CardHeader className="bg-gradient-to-r from-total-red to-orange-500 text-white">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Résumé de commande
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Product Details */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{orderData.product.displayName}</h4>
                <p className="text-sm text-muted-foreground">
                  {orderData.quantity.toLocaleString()}L × {formatCurrency(orderData.product.pricePerLiter)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{formatCurrency(orderData.subtotal)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Adresse de livraison :</span>
            </div>
            {orderData.firstName && orderData.lastName && (
              <div className="ml-6 text-sm">
                <div className="font-medium text-foreground">
                  {orderData.firstName} {orderData.lastName}
                </div>
                {orderData.street && (
                  <div className="text-muted-foreground">{orderData.street}</div>
                )}
                <div className="text-muted-foreground">
                  {orderData.zipCode} {orderData.city}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Frais de livraison</span>
              </div>
              <div className="text-right">
                {orderData.deliveryFee === 0 ? (
                  <span className="text-success-green font-semibold">Gratuit</span>
                ) : (
                  <span className="font-semibold text-foreground">{formatCurrency(orderData.deliveryFee)}</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prix net (HT)</span>
              <span className="font-medium text-foreground">{formatCurrency(netPrice - (deliveryPricing?.netPrice || 0))}</span>
            </div>
            
            {deliveryPricing && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Livraison (HT)</span>
                <span className="font-medium text-foreground">{formatCurrency(deliveryPricing.netPrice)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">TVA (20%)</span>
              <span className="font-medium text-foreground">{formatCurrency(vatAmount)}</span>
            </div>
          </div>

          <Separator className="border-border" />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-foreground">Prix total (TTC)</span>
            <span className="text-total-red text-xl">{formatCurrency(grossPrice)}</span>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Délai de livraison : 2-3 jours ouvrés</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Prix TTC • Toutes les informations sont non contractuelles
            </p>
            {orderData.deliveryFee === 0 && (
              <p className="text-xs text-success-green font-medium">
                🎉 Livraison gratuite à partir de 2 000L
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;