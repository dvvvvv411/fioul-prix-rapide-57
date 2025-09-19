import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { heizölConfig } from '@/config/heizol';
import { backendService } from '@/services/backendService';
import { Truck, Calculator, Gift } from 'lucide-react';
import { toast } from 'sonner';

const PriceCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState('premium');
  const [quantity, setQuantity] = useState('3000');
  const [zipCode, setZipCode] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    calculatePrice();
  }, [selectedProduct, quantity]);

  const calculatePrice = () => {
    const liters = parseInt(quantity) || 0;
    
    if (liters < heizölConfig.limits.minLiters) {
      setTotalPrice(0);
      setDeliveryFee(0);
      setFinalPrice(0);
      return;
    }

    const productPrice = heizölConfig.products[selectedProduct as keyof typeof heizölConfig.products].pricePerLiter;
    const subtotal = liters * productPrice;
    
    const delivery = liters >= heizölConfig.delivery.freeDeliveryThreshold ? 0 : heizölConfig.delivery.deliveryFee;
    const total = subtotal + delivery;

    setTotalPrice(subtotal);
    setDeliveryFee(delivery);
    setFinalPrice(total);
  };

  const getDeliveryMessage = () => {
    const liters = parseInt(quantity) || 0;
    if (liters >= heizölConfig.delivery.freeDeliveryThreshold) {
      return "🎉 Livraison gratuite incluse !";
    } else if (liters >= 2800) {
      return `Plus que ${heizölConfig.delivery.freeDeliveryThreshold - liters}L pour la livraison gratuite`;
    } else {
      return "Frais de livraison : 39€";
    }
  };

  const handleCheckout = async () => {
    if (parseInt(quantity) < heizölConfig.limits.minLiters) {
      toast.error(`Quantité minimum : ${heizölConfig.limits.minLiters}L`);
      return;
    }

    if (!zipCode || zipCode.length !== 5) {
      toast.error('Veuillez saisir un code postal valide');
      return;
    }

    setIsCalculating(true);
    
    try {
      const productName = heizölConfig.products[selectedProduct as keyof typeof heizölConfig.products].name;
      
      const checkoutData = {
        product: productName,
        quantity: quantity,
        zipCode: zipCode,
        shopId: heizölConfig.shopId,
        totalPrice: finalPrice, // Fixed: changed from totalPrice to finalPrice
        deliveryFee: deliveryFee
      };

      console.log('Price calculator - sending checkout data:', checkoutData);
      
      const result = await backendService.createCheckout(checkoutData);
      
      if (result.success && result.checkoutUrl) {
        console.log('Price calculator - opening checkout URL:', result.checkoutUrl);
        window.open(result.checkoutUrl, '_blank');
        
        if (result.error) {
          toast.success('Redirection vers le checkout...', {
            description: result.error
          });
        } else {
          toast.success('Redirection vers le checkout...');
        }
      } else {
        console.error('Price calculator - checkout failed:', result);
        toast.error(result.error || 'Erreur lors de la création du checkout');
      }
    } catch (error) {
      console.error('Price calculator - checkout error:', error);
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm sticky top-4 max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-t-lg pb-4">
        <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
          <Calculator size={20} />
          Calculateur de Prix Fioul
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Product Selection - Horizontal Layout */}
        <div className="mb-4">
          <Label className="text-sm font-semibold mb-2 block">
            Choisissez votre fioul
          </Label>
          <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:bg-gray-50 hover:border-orange-200 transition-colors">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                  <div className="flex flex-col">
                    <div className="font-medium text-sm text-gray-900">{heizölConfig.products.standard.displayName}</div>
                    <div className="text-xs text-gray-500">Usage quotidien</div>
                    <div className="text-lg font-bold text-red-600 mt-1">0,70€/L</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:bg-gray-50 hover:border-orange-200 transition-colors border-orange-300 bg-orange-50">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="flex flex-col">
                    <div className="font-medium flex items-center gap-1 text-sm text-gray-900">
                      {heizölConfig.products.premium.displayName}
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        Top
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Haut de gamme</div>
                    <div className="text-lg font-bold text-red-600 mt-1">0,73€/L</div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Input Fields - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="zipCode" className="text-sm font-semibold mb-1 block">
              Code postal *
            </Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="ex: 75001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]{5}"
              maxLength={5}
              className="text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity" className="text-sm font-semibold mb-1 block">
              Quantité (litres)
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="min. 1000L"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={heizölConfig.limits.minLiters}
              max={heizölConfig.limits.maxLiters}
              step="100"
              className="text-base"
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          Quantité minimum : {heizölConfig.limits.minLiters.toLocaleString()}L • Livraison gratuite dès {heizölConfig.delivery.freeDeliveryThreshold.toLocaleString()}L
        </div>

        {/* Price Breakdown - Compact Layout */}
        {parseInt(quantity) >= heizölConfig.limits.minLiters && (
          <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-3 rounded-lg mb-4 border border-orange-100">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Prix du fioul</span>
                <span className="font-bold">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Truck size={14} />
                  Livraison
                </span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'Gratuite !' : `${deliveryFee}€`}
                </span>
              </div>
            </div>
            
            {parseInt(quantity) >= heizölConfig.delivery.freeDeliveryThreshold && (
              <div className="flex items-center gap-2 text-green-600 text-xs font-medium mb-2 bg-green-50 px-2 py-1 rounded">
                <Gift size={12} />
                {getDeliveryMessage()}
              </div>
            )}
            
            <div className="border-t border-orange-200 pt-2 flex justify-between items-center text-lg font-bold">
              <span>Total TTC</span>
              <span className="text-red-600 text-xl">{finalPrice.toFixed(2)}€</span>
            </div>
            
            {parseInt(quantity) < heizölConfig.delivery.freeDeliveryThreshold && (
              <div className="text-orange-600 text-xs font-medium mt-1">
                {getDeliveryMessage()}
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button 
          onClick={handleCheckout}
          disabled={parseInt(quantity) < heizölConfig.limits.minLiters || isCalculating || !zipCode}
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-3 text-base shadow-xl disabled:opacity-50"
          size="lg"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Préparation...
            </div>
          ) : (
            `Commander maintenant - ${finalPrice.toFixed(2)}€`
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Prix indicatifs TTC • Commande minimum : {heizölConfig.limits.minLiters.toLocaleString()}L
        </p>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
