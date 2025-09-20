import React from 'react';
import visaLogo from '@/assets/visa-logo.svg';
import mastercardLogo from '@/assets/mastercard-logo.svg';
import amexLogo from '@/assets/amex-logo.svg';

interface PaymentIconsProps {
  className?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentIcons: React.FC<PaymentIconsProps> = ({ className = '', cardType = 'unknown', size = 'md' }) => {
  const showVisa = cardType === 'unknown' || cardType === 'visa';
  const showMastercard = cardType === 'unknown' || cardType === 'mastercard';
  const showAmex = cardType === 'unknown' || cardType === 'amex';

  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6', 
    lg: 'h-8'
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {showVisa && (
        <img 
          src={visaLogo} 
          alt="Visa" 
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-200 hover:scale-105 drop-shadow-sm ${cardType === 'visa' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
      {showMastercard && (
        <img 
          src={mastercardLogo} 
          alt="Mastercard" 
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-200 hover:scale-105 drop-shadow-sm ${cardType === 'mastercard' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
      {showAmex && (
        <img 
          src={amexLogo} 
          alt="American Express" 
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-200 hover:scale-105 drop-shadow-sm ${cardType === 'amex' ? 'opacity-100' : cardType === 'unknown' ? 'opacity-100' : 'opacity-30'}`}
        />
      )}
    </div>
  );
};