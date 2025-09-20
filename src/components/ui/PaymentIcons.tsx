import React from 'react';
import visaLogo from '@/assets/visa-logo.svg';
import mastercardLogo from '@/assets/mastercard-logo.svg';
import amexLogo from '@/assets/amex-logo.svg';

interface PaymentIconsProps {
  className?: string;
}

export const PaymentIcons: React.FC<PaymentIconsProps> = ({ className = '' }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <img 
        src={visaLogo} 
        alt="Visa" 
        className="h-6 w-auto object-contain"
      />
      <img 
        src={mastercardLogo} 
        alt="Mastercard" 
        className="h-6 w-auto object-contain"
      />
      <img 
        src={amexLogo} 
        alt="American Express" 
        className="h-6 w-auto object-contain"
      />
    </div>
  );
};