import React from 'react';
import visaLogo from '@/assets/visa-logo.svg';
import mastercardLogo from '@/assets/mastercard-logo.svg';
import amexLogo from '@/assets/amex-logo.svg';

interface PaymentIconsProps {
  className?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'unknown';
}

export const PaymentIcons: React.FC<PaymentIconsProps> = ({ className = '', cardType = 'unknown' }) => {
  const showVisa = cardType === 'unknown' || cardType === 'visa';
  const showMastercard = cardType === 'unknown' || cardType === 'mastercard';
  const showAmex = cardType === 'unknown' || cardType === 'amex';

  return (
    <div className={`flex gap-2 ${className}`}>
      {showVisa && (
        <img 
          src={visaLogo} 
          alt="Visa" 
          className={`h-6 w-auto object-contain transition-opacity ${cardType === 'visa' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
      {showMastercard && (
        <img 
          src={mastercardLogo} 
          alt="Mastercard" 
          className={`h-6 w-auto object-contain transition-opacity ${cardType === 'mastercard' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
      {showAmex && (
        <img 
          src={amexLogo} 
          alt="American Express" 
          className={`h-6 w-auto object-contain transition-opacity ${cardType === 'amex' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
    </div>
  );
};