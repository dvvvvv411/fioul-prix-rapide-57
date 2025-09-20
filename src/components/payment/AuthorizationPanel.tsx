import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Shield, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthorizationPanelProps {
  orderId: string;
}

const AuthorizationPanel: React.FC<AuthorizationPanelProps> = ({ orderId }) => {
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

            {/* Loading Animation */}
            <div className="flex items-center justify-center space-x-3 py-4">
              <div className="relative">
                <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
              </div>
              <span className="text-base text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Wird verarbeitet...
              </span>
            </div>

            {/* Important Notice */}
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

            {/* Payment Method Display */}
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
      <div className="text-center pt-4">
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