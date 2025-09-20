import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Google Logo */}
        <div className="flex justify-center">
          <svg width="120" height="40" viewBox="0 0 92 30" className="text-gray-700 scale-150">
            <path fill="#4285f4" d="M42.02 14.88c0 4.01-3.13 7.02-7.07 7.02s-7.07-3.01-7.07-7.02c0-4.02 3.13-7.02 7.07-7.02s7.07 3 7.07 7.02zm-2.63 0c0-2.84-2.07-4.78-4.44-4.78s-4.44 1.94-4.44 4.78c0 2.83 2.07 4.78 4.44 4.78s4.44-1.95 4.44-4.78z"/>
            <path fill="#ea4335" d="M21.8 14.88c0 4.01-3.13 7.02-7.07 7.02S7.66 18.89 7.66 14.88c0-4.02 3.13-7.02 7.07-7.02s7.07 3 7.07 7.02zm-2.63 0c0-2.84-2.07-4.78-4.44-4.78s-4.44 1.94-4.44 4.78c0 2.83 2.07 4.78 4.44 4.78s4.44-1.95 4.44-4.78z"/>
            <path fill="#fbbc05" d="M46.85 7.86v13.13c0 5.41-3.2 7.61-6.98 7.61-3.56 0-5.7-2.39-6.5-4.34l2.29-.95c.49 1.17 1.69 2.56 4.21 2.56 2.76 0 4.47-1.7 4.47-4.9v-1.05h-.13c-.82 1.02-2.39 1.91-4.37 1.91-4.15 0-7.95-3.62-7.95-8.28s3.8-8.28 7.95-8.28c1.98 0 3.55.89 4.37 1.91h.13V8.54h2.51v-.68zm-2.38 7.02c0-2.93-1.96-5.09-4.47-5.09s-4.71 2.16-4.71 5.09c0 2.92 2.2 5.09 4.71 5.09s4.47-2.17 4.47-5.09z"/>
            <path fill="#4285f4" d="M58.01 2.31v19.44h-2.63V2.31h2.63z"/>
            <path fill="#34a853" d="M67.2 17.56c-1.31 0-2.23-.59-2.82-1.76l7.77-3.21-.26-.67c-.49-1.31-1.98-3.73-5.02-3.73-3.02 0-5.54 2.37-5.54 6.17 0 3.46 2.49 6.17 5.83 6.17 2.69 0 4.25-1.65 4.9-2.61l-2.01-1.34c-.67.98-1.58 1.63-2.89 1.63v-.65zm-.33-7.7c1.03 0 1.91.52 2.2 1.27l-5.25 2.17c0-2.44 1.73-3.44 3.05-3.44z"/>
          </svg>
        </div>

        {/* Payment Processing */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-xl font-medium text-gray-900">
                  Authorizing payment
                </h1>
                <p className="text-3xl font-light text-gray-900">
                  €0.00
                </p>
              </div>

              {/* Loading Animation */}
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Processing...</span>
              </div>

              {/* Security Notice */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secured by Google Payments</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discrete Total Fioul Logo */}
        <div className="pt-4 opacity-30">
          <span className="text-xs text-gray-400">Powered by Total Fioul</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;