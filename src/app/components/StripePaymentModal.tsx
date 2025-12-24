import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Lock, CreditCard, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement,
  useStripe,
  useElements 
} from '@stripe/react-stripe-js';
import logo from 'figma:asset/25258f08dbfd42d534e2cc2de58e6a86631a05a5.png';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string; // Price in base unit (e.g., "99" for AED 99)
  currency: string; // 'aed', 'usd', etc.
  onPaymentSuccess: (paymentIntentId: string) => void;
  salonId?: string;
  userId?: string;
  type?: 'subscription' | 'booking' | 'upgrade'; // Type of payment
}

// Stripe Promise - инициализируем один раз
let stripePromise: Promise<any> | null = null;

const getStripe = async () => {
  if (!stripePromise) {
    try {
      // Получаем publishable key из backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/stripe/config`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Stripe config');
      }

      const { publishableKey, configured } = await response.json();

      if (!configured) {
        // DEMO MODE - silent mode, no warnings
        return null; // Will trigger demo mode in component
      }

      stripePromise = loadStripe(publishableKey);
    } catch (error) {
      // Silent - don't log errors in demo mode
      return null;
    }
  }
  return stripePromise;
};

// Компонент формы оплаты (внутри Elements)
function CheckoutForm({ 
  amount, 
  currency, 
  planName,
  onSuccess,
  onError 
}: { 
  amount: number;
  currency: string;
  planName: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatPrice } = useCurrency();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        toast.success('Payment successful!');
      } else {
        onError('Payment status: ' + paymentIntent?.status);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element (карта, Apple Pay, Google Pay) */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <PaymentElement />
      </div>

      {/* Информация о безопасности */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 mb-1">Secure Payment</p>
          <p className="text-blue-700">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pay {formatPrice(amount)}
          </div>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By confirming your payment, you agree to our{' '}
        <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
      </p>
    </form>
  );
}

export function StripePaymentModal({
  isOpen,
  onClose,
  planName,
  price,
  currency,
  onPaymentSuccess,
  salonId,
  userId,
  type = 'subscription'
}: StripePaymentModalProps) {
  const { formatPrice } = useCurrency();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<any>(null);

  // Конвертируем цену в минимальные единицы (центы, дирхамы и т.д.)
  const amountInMinorUnits = Math.round(parseFloat(price) * 100);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setClientSecret(null);
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      return;
    }

    // Initialize Stripe and create payment intent
    const initPayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Stripe
        const stripe = await getStripe();
        if (!stripe) {
          setError('Payment system is not available');
          setIsLoading(false);
          return;
        }
        setStripeInstance(stripe);

        // Create payment intent
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/stripe/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              amount: amountInMinorUnits,
              currency: currency.toLowerCase(),
              planName,
              salonId,
              userId,
              metadata: {
                type,
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment');
        }

        const { clientSecret: secret } = await response.json();
        setClientSecret(secret);

      } catch (err) {
        console.error('Payment initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initPayment();
  }, [isOpen, amountInMinorUnits, currency, planName, salonId, userId, type]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setIsSuccess(true);
    
    // Close after success animation and call callback
    setTimeout(() => {
      onPaymentSuccess(paymentIntentId);
      onClose();
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isOpen) return null;

  // Stripe Elements options
  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#9333ea', // purple-600
        colorBackground: '#ffffff',
        colorText: '#1f2937', // gray-800
        colorDanger: '#ef4444', // red-500
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          // Success State
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Welcome to Katia Booking {planName} plan</p>
          </div>
        ) : error ? (
          // Error State
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900">Payment Error</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Payment Failed</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Trigger re-initialization
                  const temp = isOpen;
                  onClose();
                  setTimeout(() => {
                    if (temp) {
                      // Re-open modal
                      window.location.reload(); // Simple reload for now
                    }
                  }, 100);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Payment Form
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Katia Booking" className="w-10 h-10 rounded-xl" />
                <div>
                  <h2 className="font-bold text-gray-900">Complete Payment</h2>
                  <p className="text-sm text-gray-500">{planName} Plan</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Subscription</span>
                <span className="font-semibold text-gray-900">{planName}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-semibold text-gray-900">Monthly</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatPrice(amountInMinorUnits / 100)}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Initializing secure payment...</p>
                </div>
              ) : clientSecret && stripeInstance ? (
                <Elements stripe={stripeInstance} options={options}>
                  <CheckoutForm
                    amount={amountInMinorUnits / 100}
                    currency={currency}
                    planName={planName}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600">Unable to load payment form</p>
                </div>
              )}
            </div>

            {/* Powered by Stripe */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-center text-gray-500">
                Powered by <span className="font-semibold text-[#635BFF]">Stripe</span> • 
                256-bit SSL encryption
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}