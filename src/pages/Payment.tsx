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

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Main Content - Perfect 50/50 Layout */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Authorization */}
          <div className="flex flex-col justify-start">
            <AuthorizationPanel orderId={orderId} />
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