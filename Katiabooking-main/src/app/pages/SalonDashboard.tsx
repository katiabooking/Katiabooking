import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Package,
  Settings,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Bell,
  Crown,
  ArrowUpCircle,
  RefreshCw,
} from 'lucide-react';
import { UpgradeCalculatorModal } from '../components/UpgradeCalculatorModal';
import { RefundRequestModal } from '../components/RefundRequestModal';
import { useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

export function SalonDashboard() {
  const { formatPrice } = useCurrency();
  const todayBookings = mockBookings.filter(b => b.status === 'upcoming').slice(0, 5);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<any>(null);

  // Mock current subscription data - in real app, this would come from backend
  const currentSubscription = {
    id: 'subscription:demo-user-123',
    planName: 'Standard Growth',
    price: 2243, // AED 299 * 12 * 0.75 (25% discount for annual)
    billingPeriod: 'annual' as const,
    startDate: '2024-12-17T00:00:00Z', // Started 7 days ago - eligible for refund
    expiryDate: '2025-12-17T00:00:00Z',
    status: 'active',
    paymentIntentId: 'pi_demo_123456'
  };

  const basePrices = {
    basic: 99,
    standard: 299,
    business: 499
  };

  const availableUpgrades = [
    {
      id: 'business',
      name: 'Business Pro',
      price: 4200, // Business annual with 30% discount
      billingPeriod: 'annual' as const,
      features: ['Unlimited Masters', 'Multiple Locations', 'Advanced AI', 'Priority Support']
    }
  ];

  const handleUpgradeClick = (newPlan: any) => {
    setSelectedNewPlan(newPlan);
    setIsUpgradeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Glamour Studio</h1>
              <p className="text-sm text-gray-600">Salon Owner Dashboard</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Current Subscription Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{currentSubscription.planName}</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {currentSubscription.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatPrice(currentSubscription.price)}/year • Renews on {new Date(currentSubscription.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleUpgradeClick(availableUpgrades[0])}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +12%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Today's Bookings</p>
            <p className="text-3xl font-bold">24</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +8%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
            <p className="text-3xl font-bold">$1,850</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                +5%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">New Clients</p>
            <p className="text-3xl font-bold">42</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                4.8
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold">4.8/5</p>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Today's Schedule</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>December 21, 2024</span>
                </div>
              </div>
              <div className="space-y-3">
                {todayBookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold text-purple-600">{booking.time}</p>
                        <p className="text-xs text-gray-500">{booking.service.split(' ')[0]}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Client #{idx + 1}</p>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                        <p className="text-sm text-gray-500">with {booking.staff}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">${booking.price}</p>
                      <Badge className="mt-1 bg-green-100 text-green-700 border-0">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Revenue This Week</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monday</span>
                    <span className="font-semibold">$1,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tuesday</span>
                    <span className="font-semibold">$1,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wednesday</span>
                    <span className="font-semibold">$1,650</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Thursday</span>
                    <span className="font-semibold">$1,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Friday</span>
                    <span className="font-semibold">$2,100</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg text-purple-600">$8,200</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Popular Services</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Hair Cut & Styling</p>
                      <p className="text-sm text-gray-600">156 bookings</p>
                    </div>
                    <span className="text-purple-600 font-bold">$9,840</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Hair Coloring</p>
                      <p className="text-sm text-gray-600">89 bookings</p>
                    </div>
                    <span className="text-purple-600 font-bold">$10,680</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Manicure</p>
                      <p className="text-sm text-gray-600">134 bookings</p>
                    </div>
                    <span className="text-purple-600 font-bold">$4,690</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Booking Calendar</h2>
              <div className="bg-gray-50 p-12 rounded-lg text-center text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <p>Full calendar view would be integrated here</p>
              </div>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Services Management</h2>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
              <div className="space-y-3">
                {['Haircut & Styling', 'Hair Coloring', 'Manicure', 'Pedicure', 'Facial Treatment'].map(
                  (service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{service}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span>60 min</span>
                          <span>$65</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Staff Management</h2>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {['Sarah Johnson', 'Emily Davis', 'Maria Garcia'].map((name, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                        <span className="font-bold text-purple-700">{name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-gray-600">Senior Stylist</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold">Subscription</h2>
                </div>
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-4">
                    <p className="text-sm mb-2">Current Plan</p>
                    <p className="text-3xl font-bold mb-2">{currentSubscription.planName}</p>
                    <p className="text-2xl font-bold">{formatPrice(currentSubscription.price)}/year</p>
                    <p className="text-xs mt-2 opacity-80">
                      Started: {new Date(currentSubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="flex justify-between">
                      <span>Unlimited bookings</span>
                      <span className="text-green-600">✓</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Analytics dashboard</span>
                      <span className="text-green-600">✓</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Featured placement</span>
                      <span className="text-green-600">✓</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Priority support</span>
                      <span className="text-green-600">✓</span>
                    </p>
                  </div>
                  
                  {/* 7-Day Money Back Guarantee Badge */}
                  {(() => {
                    const daysSinceStart = Math.floor((new Date().getTime() - new Date(currentSubscription.startDate).getTime()) / (1000 * 60 * 60 * 24));
                    const isEligibleForRefund = daysSinceStart <= 7;
                    
                    return isEligibleForRefund && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-orange-900 mb-1">
                          🛡️ 7-Day Money-Back Guarantee
                        </p>
                        <p className="text-xs text-orange-700">
                          You have <strong>{7 - daysSinceStart} days</strong> left to request a full refund
                        </p>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleUpgradeClick(availableUpgrades[0])}
                    className="w-full" 
                    variant="outline"
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  
                  {(() => {
                    const daysSinceStart = Math.floor((new Date().getTime() - new Date(currentSubscription.startDate).getTime()) / (1000 * 60 * 60 * 24));
                    const isEligibleForRefund = daysSinceStart <= 7;
                    
                    return isEligibleForRefund && (
                      <Button 
                        onClick={() => setIsRefundModalOpen(true)}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Request Refund
                      </Button>
                    );
                  })()}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Billing History</h2>
                <div className="space-y-3">
                  {['Dec 2024', 'Nov 2024', 'Oct 2024', 'Sep 2024'].map((month, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{month}</p>
                        <p className="text-sm text-gray-600">Professional Plan</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$99.00</p>
                        <Badge className="mt-1 bg-green-100 text-green-700 border-0">
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <SalonNotificationSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upgrade Calculator Modal */}
      <UpgradeCalculatorModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={currentSubscription}
        newPlan={selectedNewPlan || availableUpgrades[0]}
        basePrices={basePrices}
      />

      {/* Refund Request Modal */}
      {isRefundModalOpen && (
        <RefundRequestModal
          salon={{
            id: 1,
            name: 'Glamour Beauty Studio',
            owner: 'Maria Johnson',
            email: 'owner@demo.com',
            phone: '+1 (555) 123-4567',
            registered: new Date(currentSubscription.startDate).toISOString().split('T')[0],
            status: 'active',
            billingPeriod: currentSubscription.billingPeriod,
            paymentHistory: [
              {
                id: 1,
                date: new Date(currentSubscription.startDate).toISOString().split('T')[0],
                amount: Math.round(currentSubscription.price / 12), // Monthly equivalent
                status: 'success',
                method: 'Visa •••• 4242'
              }
            ]
          }}
          onClose={() => setIsRefundModalOpen(false)}
          onSubmit={(data) => {
            console.log('✅ Refund request submitted from client dashboard:', data);
            alert(`Refund request submitted!\n\nVerification email sent to: ${data.confirmationEmail}\n\nYou will receive confirmation within 24 hours.`);
            setIsRefundModalOpen(false);
          }}
        />
      )}
    </div>
  );
}