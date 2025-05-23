import React, { useState, useEffect } from 'react';
import currencyService from '../Services/CurrencyService';

/**
 * Price Component
 * Displays a price in the user's selected currency
 * 
 * @param {Object} props
 * @param {number|string} props.amount - The price amount in USD (can be numeric or string)
 * @param {string} props.className - Additional CSS classes for the price display
 * @param {boolean} props.showCode - Whether to show the currency code (e.g., USD, INR)
 */
const Price = ({ amount, className = '', showCode = false }) => {
  const [formattedPrice, setFormattedPrice] = useState('');
  const [currencyCode, setCurrencyCode] = useState(currencyService.getCurrency());
  
  useEffect(() => {
    // Format the price on mount
    formatPrice();
    
    // Listen for currency changes
    const handleCurrencyChange = (e) => {
      setCurrencyCode(e.detail.currency);
      formatPrice(e.detail.currency);
    };
    
    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, [amount]);
  
  const formatPrice = (currency = null) => {
    if (amount === undefined || amount === null) {
      setFormattedPrice('');
      return;
    }
    
    try {
      const price = currencyService.convertAndFormat(amount, currency);
      setFormattedPrice(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      setFormattedPrice(amount.toString());
    }
  };
  
  return (
    <span className={`price ${className}`}>
      {formattedPrice}
      {showCode && <span className="ml-1 text-xs text-white opacity-70">{currencyCode}</span>}
    </span>
  );
};

export default Price; 