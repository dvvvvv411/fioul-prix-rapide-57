import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomerInfo } from '@/types/checkout';
import { Mail, MapPin, CreditCard, FileText, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutFormProps {
  initialZipCode: string;
  totalPrice: number;
  onSubmit: (customerInfo: CustomerInfo) => void;
  isSubmitting: boolean;
}

const CheckoutForm = ({ initialZipCode, totalPrice, onSubmit, isSubmitting }: CheckoutFormProps) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    zipCode: initialZipCode,
    city: '',
    agreeToTerms: false,
  });

  const handleInputChange = (field: keyof CustomerInfo, value: string | boolean) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(customerInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5 text-muted-foreground" />
            E-Mail Adresse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              E-Mail Adresse *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre.email@beispiel.de"
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
            Lieferadresse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                Vorname *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Max"
                value={customerInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                Nachname *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Mustermann"
                value={customerInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
              Telefonnummer *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 1 23 45 67 89"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="street" className="text-sm font-medium text-muted-foreground">
              Straße und Hausnummer *
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
                PLZ *
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
                Stadt *
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
            Zahlungsart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-foreground">Kreditkarte</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Privacy Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-muted-foreground" />
            AGB & Datenschutz
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
              Ich stimme den{' '}
              <a href="/cgv" target="_blank" className="text-total-blue hover:underline font-medium">
                Allgemeinen Geschäftsbedingungen
              </a>{' '}
              und der{' '}
              <a href="/politique-confidentialite" target="_blank" className="text-total-blue hover:underline font-medium">
                Datenschutzerklärung
              </a>{' '}
              zu *
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
            Verarbeitung...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Jetzt kostenpflichtig bestellen - {totalPrice.toFixed(2)}€
          </div>
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;