import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthorizationPanel from '@/components/payment/AuthorizationPanel';
import OrderDetailsPanel from '@/components/payment/OrderDetailsPanel';
import { usePaymentSession } from '@/hooks/usePaymentSession';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  // Track payment session
  const { sessionId } = usePaymentSession({
    orderId: orderId || '',
    enabled: !!orderId
  });

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
  }, [orderId, navigate]);

  // Auto-scroll to top on page load for better mobile UX
  useEffect(() => {
    if (orderId) {
      window.scrollTo(0, 0);
    }
  }, [orderId]);

  if (!orderId) {
    return null;
  }

  // Show loading until sessionId is ready
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center lg:items-center pt-6 lg:pt-0">
      {/* Main Content - Perfect 50/50 Layout */}
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Warning Message - Desktop: centered above cards */}
        <div className="hidden lg:block w-fit mx-auto mb-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 text-amber-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <p className="text-amber-800 text-sm font-medium">
              Cette opération peut prendre quelques minutes. Veuillez ne pas quitter cette page.
            </p>
          </div>
        </div>

        {/* Warning Message - Mobile only */}
        <div className="lg:hidden mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-amber-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <p className="text-amber-800 text-sm font-medium">
            Cette opération peut prendre quelques minutes. Veuillez ne pas quitter cette page.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Authorization */}
          <div className="flex flex-col justify-start">
            <AuthorizationPanel orderId={orderId} sessionId={sessionId} />
          </div>
          
          {/* Right Column - Order Details */}
          <div className="flex flex-col justify-start">
            <OrderDetailsPanel orderId={orderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;