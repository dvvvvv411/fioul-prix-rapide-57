import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import GooglePaymentHeader from '@/components/payment/GooglePaymentHeader';
import AuthorizationPanel from '@/components/payment/AuthorizationPanel';
import OrderDetailsPanel from '@/components/payment/OrderDetailsPanel';

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

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google Payment Header */}
      <GooglePaymentHeader />
      
      {/* Main Content - 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Authorization */}
          <div className="order-2 lg:order-1">
            <AuthorizationPanel />
          </div>
          
          {/* Right Column - Order Details */}
          <div className="order-1 lg:order-2">
            <OrderDetailsPanel orderId={orderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;