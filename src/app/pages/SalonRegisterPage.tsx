import { saveUserRole, saveSalonData, validateInviteToken } from '../../utils/salonRoles';
import { toast } from 'sonner';
import type { UserRole } from '../../types/roles';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function SalonRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, signInWithFacebook, user } = useAuth();
  const { currency, convertPrice, formatPrice } = useCurrency();
  
  // Check if this is an invitation link
  const inviteToken = searchParams.get('invite');
  const invitedRole = searchParams.get('role') as UserRole | null;
  const invitedSalonId = searchParams.get('salon');
  
  // Check if coming from pricing page with selected plan
  const selectedPlanFromUrl = searchParams.get('plan');
  const planPrice = searchParams.get('price');
  
  const [step, setStep] = useState<'auth' | 'details'>(inviteToken ? 'auth' : 'auth');
  const [selectedRole, setSelectedRole] = useState<UserRole>(invitedRole || 'owner');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'professional' | 'enterprise'>('professional');
  
  // Subscription plans
  const subscriptionPlans = {
    essential: {
      name: 'Essential',
      price: 27,
      icon: Crown,
      features: [
        '2 Masters',
        'No Admins',
        '15 Services',
        'Basic Online Booking',
        '24/7 Push Notifications',
        'Client Database'
      ]
    },
    professional: {
      name: 'Professional',
      price: 81,
      icon: Zap,
      features: [
        '6 Masters',
        '1 Admin',
        '50 Services',
        'AI Receptionist (Basic)',
        '24/7 Push Notifications',
        'Marketing Tools'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 243,
      icon: Sparkles,
      features: [
        'Unlimited Masters',
        'Unlimited Admins',
        'Unlimited Services',
        'AI Receptionist (Advanced)',
        '24/7 Push Notifications',
        'Advanced Analytics'
      ]
    }
  };
  
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Salon details (only for owner)
  const [salonName, setSalonName] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  
  const roles = [
    {
      id: 'owner' as UserRole,
      icon: Building2,
      title: 'Owner',
      description: 'Full access to manage everything',
      features: [
        'Multi-salon management',
        'Staff management & invitations',
        'Full analytics & reports',
        'Export/Import client data',
        'Payment & subscription management'
      ],
      color: 'from-purple-600 to-pink-600',
      disabled: inviteToken !== null, // Can't select owner if coming from invite
    },
    {
      id: 'admin' as UserRole,
      icon: Shield,
      title: 'Administrator',
      description: 'Manage bookings and clients',
      features: [
        'View all bookings & calendar',
        'Manage client database',
        'View client phone numbers',
        'Edit services & pricing',
        'Access marketing tools'
      ],
      color: 'from-blue-600 to-cyan-600',
      disabled: inviteToken !== null && invitedRole !== 'admin',
    },
    {
      id: 'master' as UserRole,
      icon: Scissors,
      title: 'Master',
      description: 'View your own schedule',
      features: [
        'View your appointments',
        'See client names',
        'Manage your availability',
        'Limited permissions',
        'No admin access'
      ],
      color: 'from-green-600 to-emerald-600',
      disabled: inviteToken !== null && invitedRole !== 'master',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Only owners need to select subscription
    if (role === 'owner') {
      setStep('subscription');
    } else {
      setStep('auth');
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error('Failed to sign in with Google: ' + error.message);
      setIsLoading(false);
    }
    // On success, will redirect automatically
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    const { error } = await signInWithFacebook();
    if (error) {
      toast.error('Failed to sign in with Facebook: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    
    const fullName = `${firstName} ${lastName}`;
    const { error } = await signUpWithEmail(email, password, fullName);
    
    if (error) {
      toast.error('Failed to create account: ' + error.message);
      setIsLoading(false);
    } else {
      // If owner, proceed to salon details
      if (selectedRole === 'owner') {
        setStep('details');
        setIsLoading(false);
      } else {
        // For admin/master with invite, complete registration
        toast.success('Account created! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/redirect');
        }, 1500);
      }
    }
  };

  const handleSalonDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!salonName || !salonAddress) {
      toast.error('Please fill in all salon details');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated. Please sign in again.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate salon ID
      const salonId = `salon_${Math.random().toString(36).substring(2)}${Date.now()}`;
      
      // Save salon data
      await saveSalonData({
        id: salonId,
        name: salonName,
        ownerId: user.id,
        plan: selectedPlanFromUrl || 'professional',
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdAt: new Date().toISOString(),
      });

      // Save user role as owner
      await saveUserRole(user.id, salonId, 'owner');
      
      toast.success('Salon registered successfully! 🎉');
      setTimeout(() => {
        navigate(`/salon-dashboard?salon=${salonId}&role=owner`);
      }, 1500);
    } catch (error) {
      console.error('Error creating salon:', error);
      toast.error('Failed to create salon. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => {
            if (step === 'auth') setStep('role');
            else if (step === 'details') setStep('auth');
            else navigate('/');
          }}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">
            {step === 'role' ? 'Back to Home' : 'Back'}
          </span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {inviteToken ? 'Accept Invitation' : selectedPlanFromUrl ? 'Complete Registration' : 'Create Salon Account'}
          </h1>
          <p className="text-gray-600">
            {inviteToken 
              ? `You've been invited to join as ${invitedRole}`
              : selectedPlanFromUrl
              ? 'Set up your salon and start accepting bookings'
              : 'Join thousands of successful salons'
            }
          </p>
        </div>

        {/* Plan Info Banner (if coming from pricing) */}
        {selectedPlanFromUrl && planPrice && !inviteToken && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">
                  {selectedPlanFromUrl.charAt(0).toUpperCase() + selectedPlanFromUrl.slice(1)} Plan Selected
                </h3>
                <p className="text-sm text-purple-700">
                  {formatPrice(Number(planPrice))}/month • Get started today
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Role Selection */}
        {step === 'role' && !inviteToken && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`border-2 hover:border-purple-300 transition-all cursor-pointer relative overflow-hidden ${
                  role.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !role.disabled && handleRoleSelect(role.id)}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${role.color}`} />
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mx-auto mb-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Invitation Banner */}
        {inviteToken && step === 'auth' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  You've been invited!
                </h3>
                <p className="text-sm text-blue-700">
                  Complete your registration to join the team as {invitedRole === 'admin' ? 'Administrator' : 'Master'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Subscription Selection */}
        {step === 'subscription' && (
          <div className="space-y-6">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Choose Your Plan</CardTitle>
                    <CardDescription>
                      Select the perfect subscription for your salon
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(Object.keys(subscriptionPlans) as Array<keyof typeof subscriptionPlans>).map((planKey) => {
                    const plan = subscriptionPlans[planKey];
                    const PlanIcon = plan.icon;
                    const isSelected = selectedPlan === planKey;
                    
                    return (
                      <Card
                        key={planKey}
                        className={`border-2 hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden ${
                          isSelected ? 'border-purple-600 shadow-lg scale-105' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPlan(planKey)}
                      >
                        {planKey === 'professional' && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                            POPULAR
                          </div>
                        )}
                        <CardHeader className="text-center pb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-3">
                            <PlanIcon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <div className="mt-3">
                            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-gray-500 text-sm">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Get Started Today
                        </h4>
                        <p className="text-sm text-gray-600">
                          Set up your salon and start accepting bookings instantly. Cancel anytime with no commitment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => {
                      toast.success(`${subscriptionPlans[selectedPlan].name} plan selected! Proceeding to payment...`);
                      // Simulate Stripe redirect
                      setTimeout(() => {
                        toast.info('Stripe checkout would open here in production');
                        setStep('auth');
                      }, 1500);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : `Continue with ${subscriptionPlans[selectedPlan].name} Plan`}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Authentication */}
        {step === 'auth' && (
          <Card className="border-0 shadow-2xl max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                  selectedRole === 'owner' ? 'from-purple-600 to-pink-600' :
                  selectedRole === 'admin' ? 'from-blue-600 to-cyan-600' :
                  'from-green-600 to-emerald-600'
                } flex items-center justify-center`}>
                  {selectedRole === 'owner' ? <Building2 className="w-6 h-6 text-white" /> :
                   selectedRole === 'admin' ? <Shield className="w-6 h-6 text-white" /> :
                   <Scissors className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Registering as {selectedRole === 'owner' ? 'Owner' : selectedRole === 'admin' ? 'Administrator' : 'Master'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Social Auth */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                  onClick={handleFacebookAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Salon Details (Owner only) */}
        {step === 'details' && selectedRole === 'owner' && (
          <Card className="border-0 shadow-2xl max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Salon Details</CardTitle>
              <CardDescription>Tell us about your salon</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSalonDetailsSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="salonName">Salon Name</Label>
                  <Input
                    id="salonName"
                    type="text"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="Beauty Studio"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salonAddress">Address</Label>
                  <Input
                    id="salonAddress"
                    type="text"
                    value={salonAddress}
                    onChange={(e) => setSalonAddress(e.target.value)}
                    placeholder="123 Main St, City, Country"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    ℹ️ After registration, you can add services, team members, photos, and configure your salon settings from the dashboard.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Salon...' : 'Complete Registration'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}