import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';

const AuthorizationPanel = () => {
  return (
    <div className="space-y-6">
      {/* Main Authorization Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="pt-8 pb-8">
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
                    •••• •••• •••• 1234
                  </span>
                </div>
                <Lock className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium">PCI-DSS</p>
          <p className="text-xs text-gray-500">Compliant</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium">256-bit</p>
          <p className="text-xs text-gray-500">Encryption</p>
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