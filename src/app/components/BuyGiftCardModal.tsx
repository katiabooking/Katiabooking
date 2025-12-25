import { useState } from 'react';
import { X, Gift, Mail, User, MessageSquare, CreditCard, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';
import { StripePaymentModal } from './StripePaymentModal';
import { GiftCardPreview } from './GiftCardPreview';
import { GiftCardTheme, GIFT_CARD_THEMES, SalonGiftCardBranding } from '../types/giftCardTemplates';

interface BuyGiftCardModalProps {
  salonId: string;
  salonName: string;
  onClose: () => void;
}

export function BuyGiftCardModal({ salonId, salonName, onClose }: BuyGiftCardModalProps) {
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<'theme' | 'details' | 'payment' | 'success'>('theme');
  
  // Form state
  const [selectedTheme, setSelectedTheme] = useState<GiftCardTheme>('just-because');
  const [amount, setAmount] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');

  const predefinedAmounts = [100, 200, 300, 500, 1000];
  
  // Mock salon branding (в реале загружается с backend)
  const salonBranding: SalonGiftCardBranding = {
    salonId,
    logoPosition: 'top-left',
    defaultTheme: 'just-because',
    allowCustomThemes: true,
  };

  const isDetailsValid = amount && purchaserName && purchaserEmail && purchaserPhone;

  const handleProceedToPayment = () => {
    if (!isDetailsValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    // Generate unique gift card code
    const code = `GIFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setGeneratedCode(code);
    
    // TODO: Save to backend
    console.log('Gift card purchased:', {
      salonId,
      code,
      amount: parseFloat(amount),
      purchaserName,
      purchaserEmail,
      purchaserPhone,
      recipientName: recipientName || undefined,
      recipientEmail: recipientEmail || undefined,
      message: message || undefined,
      sendNow
    });

    setStep('success');
    toast.success('Gift card purchased successfully! 🎉');
  };

  const handleClose = () => {
    if (step === 'payment') {
      if (confirm('Are you sure you want to cancel the payment?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'theme' && '🎨 Select Theme'}
              {step === 'details' && '🎁 Buy Gift Card'}
              {step === 'payment' && '💳 Payment'}
              {step === 'success' && '✅ Purchase Complete'}
            </h2>
            <p className="text-sm text-gray-600">{salonName}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'theme' && (
            <div className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-sm font-medium text-gray-900">Theme</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-600">Details</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-600">Payment</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <span className="text-sm font-medium text-gray-600">Complete</span>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Gift Card Theme *
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {GIFT_CARD_THEMES.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTheme === theme
                          ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{theme}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-900">Details</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-600">Payment</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <span className="text-sm font-medium text-gray-600">Complete</span>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Gift Card Amount *
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        amount === amt.toString()
                          ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{formatPrice(amt)}</div>
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Or enter custom amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full"
                  min="10"
                />
                {amount && parseFloat(amount) < 10 && (
                  <p className="text-xs text-red-600 mt-1">Minimum amount is {formatPrice(10)}</p>
                )}
              </div>

              {/* Your Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={purchaserPhone}
                      onChange={(e) => setPurchaserPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      placeholder="john@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send the gift card details to this email
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-600" />
                  Recipient Information (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send this gift card to someone special. Leave blank to send to yourself.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name
                    </label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email
                    </label>
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="jane@email.com"
                    />
                  </div>
                </div>

                {recipientEmail && (
                  <div className="mt-4">
                    <label className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendNow}
                        onChange={(e) => setSendNow(e.target.checked)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Send gift card immediately</div>
                        <div className="text-sm text-gray-600">
                          The recipient will receive the gift card via email after purchase
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Gift Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Add a Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday! Hope you enjoy your spa day! 🎉"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
              </div>

              {/* Preview */}
              {amount && parseFloat(amount) >= 10 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                  <GiftCardPreview
                    salonName={salonName}
                    amount={parseFloat(amount)}
                    purchaserName={purchaserName}
                    recipientName={recipientName}
                    message={message}
                    theme={selectedTheme}
                    salonBranding={salonBranding}
                  />
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gift Card Amount</span>
                    <span className="font-semibold text-gray-900">{formatPrice(parseFloat(amount))}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-purple-600">{formatPrice(parseFloat(amount))}</span>
                  </div>
                </div>
              </div>

              {/* Stripe Payment */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Payment Details
                </h3>
                <StripePaymentModal
                  isOpen={true}
                  onClose={() => setStep('details')}
                  amount={parseFloat(amount)}
                  currency="AED"
                  description={`Gift Card - ${salonName}`}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Gift Card Purchased! 🎉
                </h3>
                <p className="text-gray-600">
                  Your gift card has been created and sent to your email
                </p>
              </div>

              {/* Gift Card Code */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white">
                <div className="mb-4">
                  <div className="text-sm opacity-90 mb-1">{salonName}</div>
                  <div className="text-4xl font-bold mb-2">{formatPrice(parseFloat(amount))}</div>
                  <div className="text-sm opacity-90">Gift Card</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="text-xs opacity-90 mb-1">Gift Card Code</div>
                  <div className="font-mono text-xl font-bold tracking-wider">{generatedCode}</div>
                </div>

                {message && (
                  <div className="bg-white/20 rounded-lg p-3 mb-4">
                    <p className="text-sm italic">"{message}"</p>
                  </div>
                )}

                <div className="text-sm opacity-90 text-left">
                  <div>From: {purchaserName}</div>
                  {recipientName && <div>To: {recipientName}</div>}
                </div>
              </div>

              {/* Information */}
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      A confirmation email has been sent to <strong>{purchaserEmail}</strong>
                    </span>
                  </li>
                  {recipientEmail && sendNow && (
                    <li className="flex items-start gap-2">
                      <Gift className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        The gift card has been sent to <strong>{recipientEmail}</strong>
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      The gift card can be used for any service at {salonName}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast.success('Gift card code copied!');
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  Copy Code
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (for details step) */}
        {step === 'details' && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={!isDetailsValid || parseFloat(amount) < 10}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Proceed to Payment
              <CreditCard className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}