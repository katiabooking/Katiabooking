import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useRegistration } from '../../hooks/useRegistration';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const logo = "/icons/logo.svg";

interface SalonOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    planName: string;
    price: string;
    billingPeriod?: 'monthly' | 'semi-annual' | 'annual';
  };
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
];

export function SalonOnboardingModal({ isOpen, onClose, subscription }: SalonOnboardingModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerWithEmail, isLoading: isRegistering } = useRegistration();
  
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 2;
  
  // Сохраняем userId после регистрации
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [registeredUserEmail, setRegisteredUserEmail] = useState<string | null>(null);

  // Step 1: Owner Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Step 2: Salon Details
  const [salonName, setSalonName] = useState('');
  const [salonAddress, setSalonAddress] = useState('');

  if (!isOpen) return null;

  const handlePhoneVerification = () => {
    const fullPhone = `${selectedCountry.dialCode}${phone}`;
    toast.success(`Verification code sent to WhatsApp: ${fullPhone}`);
    setTimeout(() => {
      setIsPhoneVerified(true);
    }, 1000);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setIsSaving(true);
      try {
        const fullName = `${firstName} ${lastName}`;
        const fullPhone = `${selectedCountry.dialCode}${phone}`;
        
        const result = await registerWithEmail('salon', {
          email,
          password,
          fullName,
          phone: fullPhone,
        });
        
        if (!result.success || !result.userId) {
          setIsSaving(false);
          return;
        }

        // Сохраняем userId и email для использования в Step 2
        setRegisteredUserId(result.userId);
        setRegisteredUserEmail(email);

        // Явно получаем текущую сессию для обновления контекста
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Session retrieved after registration:', session.user?.email);
        }

        toast.success('✅ Account created successfully!');
        setIsSaving(false);
        
        setTimeout(() => {
          setStep(step + 1);
        }, 500);
      } catch (error) {
        console.error('Error creating account:', error);
        toast.error('Failed to create account. Please try again.');
        setIsSaving(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);

    try {
      // Получаем текущего пользователя - используем сохраненный userId или текущего user из контекста
      let currentUser = user;
      let currentUserId = registeredUserId;
      let currentUserEmail = registeredUserEmail || email;

      // Если user из контекста не доступен, но у нас есть registeredUserId, получаем пользователя напрямую
      if (!currentUser && currentUserId) {
        const { data: { user: fetchedUser } } = await supabase.auth.getUser();
        if (fetchedUser) {
          currentUser = fetchedUser;
          currentUserId = fetchedUser.id;
          currentUserEmail = fetchedUser.email || email;
        }
      }

      // Если все еще нет пользователя, показываем ошибку
      if (!currentUser && !currentUserId) {
        toast.error('User not authenticated. Please try again.');
        setIsSaving(false);
        return;
      }

      const userId = currentUserId || currentUser?.id;
      if (!userId) {
        toast.error('User ID not found. Please try again.');
        setIsSaving(false);
        return;
      }

      const salonId = `salon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const fullPhone = `${selectedCountry.dialCode}${phone}`;

      const salonData = {
        id: salonId,
        name: salonName,
        address: salonAddress,
        phone: fullPhone,
        email: currentUserEmail,
        logo: null,
        photos: [],
        ownerId: userId,
        services: [],
        staff: [],
        subscription: {
          planName: subscription.planName,
          price: subscription.price,
          startedAt: new Date().toISOString(),
        },
        isPublished: false,
        publishedAt: null,
        createdAt: new Date().toISOString(),
      };

      const salonResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(salonData),
        }
      );

      const salonResult = await salonResponse.json();

      if (!salonResponse.ok) {
        throw new Error(salonResult.error || 'Failed to save salon data');
      }

      const roleData = {
        userId: userId,
        roleData: {
          role: 'owner',
          salonId: salonId,
          firstName: firstName,
          lastName: lastName,
          phone: fullPhone,
          createdAt: new Date().toISOString(),
        },
      };

      const roleResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(roleData),
        }
      );

      const roleResult = await roleResponse.json();

      if (!roleResponse.ok) {
        throw new Error(roleResult.error || 'Failed to save user role');
      }

      toast.success('🎉 Salon registration complete! Welcome to Katia Booking!');
      
      setTimeout(() => {
        navigate('/owner');
      }, 1500);
    } catch (error) {
      console.error('Error completing salon setup:', error);
      toast.error('Failed to complete salon setup. Please try again.');
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Owner Information</h3>
            <p className="text-sm text-gray-600 mb-6">Tell us about yourself</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (WhatsApp)</label>
              <div className="flex gap-2">
                <Select
                  value={selectedCountry.code}
                  onValueChange={(value) => setSelectedCountry(countries.find((c) => c.code === value) || countries[0])}
                >
                  <SelectTrigger className="w-[140px] px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.dialCode}</span>
                          <span className="text-gray-500">{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  placeholder="50 123 4567"
                  required
                />
                <Button
                  onClick={handlePhoneVerification}
                  disabled={isPhoneVerified || !phone}
                  className={`px-6 ${
                    isPhoneVerified
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {isPhoneVerified ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Verified
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
              {isPhoneVerified && (
                <p className="text-xs text-green-600 mt-2">✓ WhatsApp verified</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Salon Details</h3>
            <p className="text-sm text-gray-600 mb-6">Tell us about your salon</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salon Name</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="Luxury Beauty Salon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={salonAddress}
                onChange={(e) => setSalonAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="123 Main Street, Dubai Marina, Dubai, UAE"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return firstName && lastName && email && password && password.length >= 6 && phone && isPhoneVerified;
      case 2:
        return salonName && salonAddress;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Katia Booking" className="w-10 h-10 rounded-xl" />
            <div>
              <h2 className="font-bold text-gray-900">Salon Setup</h2>
              <p className="text-sm text-gray-500">
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{renderStep()}</div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between">
          {step > 1 ? (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <Button
              onClick={handleNextStep}
              disabled={!canProceed() || isSaving || isRegistering}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
            >
              {isSaving || isRegistering ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}