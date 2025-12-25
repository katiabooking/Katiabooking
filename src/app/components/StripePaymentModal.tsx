import { useState } from 'react';
import { X, CreditCard, Lock, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  description: string;
  bookingId?: string;
  onSuccess: () => void;
}

export function StripePaymentModal({
  isOpen,
  onClose,
  amount,
  currency,
  description,
  bookingId,
  onSuccess,
}: StripePaymentModalProps) {
  const { formatPrice } = useCurrency();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState('');

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    if (!cardholderName) {
      setError('Cardholder name is required');
      return false;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }

    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }

    const month = parseInt(expiryParts[0]);
    if (month < 1 || month > 12) {
      setError('Invalid month (01-12)');
      return false;
    }

    if (cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return false;
    }

    setError('');
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // TODO: Integrate with real Stripe.js
      // 1. Create Payment Intent on backend
      // const response = await fetch(`/api/bookings/${bookingId}/create-payment`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     amount,
      //     paymentType: 'deposit',
      //     ...
      //   })
      // });
      // const { clientSecret } = await response.json();

      // 2. Confirm payment with Stripe.js
      // const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      // const result = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement,
      //     billing_details: { name: cardholderName }
      //   }
      // });

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      toast.success('Payment successful! 🎉');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>

        {/* Amount */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
            <div className="text-4xl font-bold text-purple-600">
              {formatPrice(amount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currency.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              disabled={isProcessing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                disabled={isProcessing}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
              <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                disabled={isProcessing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                disabled={isProcessing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Security Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800">
              <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
              We never store your card details.
            </div>
          </div>

          {/* Test Card Info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
            <div className="font-semibold mb-1">Test Card (Development):</div>
            <div className="font-mono">4242 4242 4242 4242</div>
            <div className="font-mono">Expiry: Any future date • CVV: Any 3 digits</div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            onClick={onClose}
            disabled={isProcessing}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay {formatPrice(amount)}
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Secured by Stripe</span>
            </div>
            <span>•</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
