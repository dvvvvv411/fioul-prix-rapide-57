
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { heizölConfig } from '@/config/heizol';
import { backendService } from '@/services/backendService';
import { Calculator, MapPin, Fuel, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const HorizontalPriceCalculator = () => {
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

      console.log('Horizontal calculator - sending checkout data:', checkoutData);
      
      const result = await backendService.createCheckout(checkoutData);
      
      if (result.success && result.checkoutUrl) {
        console.log('Horizontal calculator - opening checkout URL:', result.checkoutUrl);
        window.open(result.checkoutUrl, '_blank');
        
        if (result.error) {
          toast.success('Redirection vers le checkout...', {
            description: result.error
          });
        } else {
          toast.success('Redirection vers le checkout...');
        }
      } else {
        console.error('Horizontal calculator - checkout failed:', result);
        toast.error(result.error || 'Erreur lors de la création du checkout');
      }
    } catch (error) {
      console.error('Horizontal calculator - checkout error:', error);
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-red-600" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Calculateur de Prix</h3>
      </div>
      
      {/* Horizontal Calculator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
        {/* Zip Code - moved to first position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Code postal *
          </label>
          <div className={`p-4 rounded-lg border-2 text-left transition-all h-16 flex items-center ${
            zipCode ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200 bg-white'
          }`}>
            <Input
              type="text"
              placeholder="75001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]{5}"
              maxLength={5}
              className="border-0 bg-transparent p-0 text-lg font-bold text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
          </div>
        </div>

        {/* Quantity - moved to second position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Fuel size={16} className="inline mr-1" />
            Quantité (L)
          </label>
          <div className={`p-4 rounded-lg border-2 text-left transition-all h-16 flex items-center ${
            quantity ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200 bg-white'
          }`}>
            <Input
              type="number"
              placeholder="3000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={heizölConfig.limits.minLiters}
              max={heizölConfig.limits.maxLiters}
              step="100"
              className="border-0 bg-transparent p-0 text-lg font-bold text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Product Selection - moved to third position */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de fioul</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedProduct('standard')}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedProduct === 'standard'
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className="text-sm font-medium">{heizölConfig.products.standard.displayName}</div>
              <div className="text-lg font-bold text-red-600">0,70€/L</div>
            </button>
            <button
              onClick={() => setSelectedProduct('premium')}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedProduct === 'premium'
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className="text-sm font-medium flex items-center gap-1">
                {heizölConfig.products.premium.displayName}
                <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">TOP</span>
              </div>
              <div className="text-lg font-bold text-red-600">0,73€/L</div>
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Prix total TTC</div>
          {parseInt(quantity) >= heizölConfig.limits.minLiters ? (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-red-600">{finalPrice.toFixed(2)}€</div>
              {deliveryFee === 0 && (
                <div className="text-xs text-green-600 font-medium">Livraison gratuite !</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-3">
              Min. {heizölConfig.limits.minLiters.toLocaleString()}L
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div>
          <Button 
            onClick={handleCheckout}
            disabled={parseInt(quantity) < heizölConfig.limits.minLiters || isCalculating || !zipCode}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold shadow-xl disabled:opacity-50"
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Préparation...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Commander</span>
                <span className="sm:hidden">Go</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Prix indicatifs TTC • Commande minimum : {heizölConfig.limits.minLiters.toLocaleString()}L • Livraison gratuite dès {heizölConfig.delivery.freeDeliveryThreshold.toLocaleString()}L
        {parseInt(quantity) >= 2800 && parseInt(quantity) < heizölConfig.delivery.freeDeliveryThreshold && (
          <span className="text-orange-600 font-medium ml-2">
            • Plus que {heizölConfig.delivery.freeDeliveryThreshold - parseInt(quantity)}L pour la livraison gratuite
          </span>
        )}
      </div>
    </div>
  );
};

export default HorizontalPriceCalculator;
