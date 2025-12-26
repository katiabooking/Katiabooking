import { FavoritesAnalytics } from './FavoritesAnalytics';
import { FeedAnalytics } from './FeedAnalytics';
import type { User, UserRole, Salon, Booking, Client } from '../../types/roles';
import { PERMISSIONS, hasPermission } from '../../types/roles';

interface SalonDashboardProps {
  currentUser: User;
  salons: Salon[];
  currentSalonId: string;
  onSalonChange: (salonId: string) => void;
  onAddSalon?: () => void;
  onLogout: () => void;
  isDemo?: boolean;
}

export function SalonDashboard({
  currentUser,
  salons,
  currentSalonId,
  onSalonChange,
  onAddSalon,
  onLogout,
  isDemo = false,
}: SalonDashboardProps) {
  console.log('🔥 SALON DASHBOARD COMPONENT RENDERED!');
  console.log('🔥 Current user:', currentUser);
  console.log('🔥 Salons:', salons);
  console.log('🔥 Is Demo:', isDemo);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const currentSalon = salons.find(s => s.id === currentSalonId);
  const permissions = PERMISSIONS[currentUser.role];

  // Mock data - replace with real data from backend
  const mockBookings: Booking[] = [];
  const mockClients: Client[] = [];

  const stats = {
    todayBookings: 12,
    weekRevenue: 3250,
    totalClients: 245,
    growthRate: 15.3,
  };

  const handleInviteStaff = (email: string, firstName: string, lastName: string, role: UserRole, services?: string[]) => {
    console.log('Inviting staff:', { email, firstName, lastName, role, services });
    // TODO: Send email invitation via backend
    alert(`Invitation sent to ${email}!`);
  };

  const handleImportClients = (data: any[]) => {
    console.log('Importing clients:', data);
    // TODO: Process and save imported clients
  };

  const renderSidebar = () => {
    const menuItems = [
      { id: 'overview', icon: BarChart3, label: 'Overview', roles: ['owner', 'admin', 'master'] },
      { id: 'my-salons', icon: Store, label: '🏪 My Salons', roles: ['owner'] },
      { id: 'calendar', icon: Calendar, label: 'Calendar', roles: ['owner', 'admin'] },
      { id: 'my-schedule', icon: Calendar, label: 'My Schedule', roles: ['master'] },
      { id: 'clients', icon: Users, label: 'Clients', roles: ['owner', 'admin'] },
      { id: 'masters', icon: Target, label: 'Masters & Targets', roles: ['admin'] },
      { id: 'services', icon: Scissors, label: 'Services', roles: ['owner', 'admin'] },
      
      // 🚀 GAME-CHANGING FEATURES
      { id: 'package-deals', icon: Package, label: '📦 Package Deals', roles: ['owner'] },
      { id: 'dynamic-pricing', icon: TrendingUp, label: '💰 Dynamic Pricing', roles: ['owner'] },
      { id: 'gift-cards', icon: Gift, label: '🎁 Gift Cards', roles: ['owner', 'admin'] },
      { id: 'referral-program', icon: Gift, label: '💝 Referral Program', roles: ['owner'] },
      { id: 'ai-smart-filling', icon: Brain, label: '🤖 AI Smart Filling', roles: ['owner'] },
      { id: 'advanced-forecasting', icon: Zap, label: ' Forecasting', roles: ['owner'] },
      { id: 'booking-settings', icon: Settings, label: '⚙️ Booking Settings', roles: ['owner'] },
      
      { id: 'products', icon: Package, label: 'Products', roles: ['admin'] },
      { id: 'beauty-feed', icon: Camera, label: 'Beauty Feed', roles: ['admin'] },
      { id: 'inventory', icon: Package, label: 'Inventory', roles: ['owner', 'admin'] },
      { id: 'attendance', icon: Users, label: 'Attendance', roles: ['owner', 'admin'] },
      { id: 'reviews', icon: Star, label: 'Reviews', roles: ['owner', 'admin'] },
      { id: 'staff', icon: UserPlus, label: 'Staff Management', roles: ['owner'] },
      { id: 'expense', icon: DollarSign, label: 'Expenses', roles: ['owner'] },
      { id: 'loyalty', icon: Gift, label: 'Loyalty Program', roles: ['owner'] },
      { id: 'advanced-analytics', icon: BarChart3, label: 'Advanced Analytics', roles: ['owner'] },
      { id: 'feed-analytics', icon: TrendingUp, label: 'Feed Analytics', roles: ['owner', 'admin'] },
      { id: 'notifications', icon: Bell, label: 'Notifications', roles: ['owner', 'admin', 'master'] },
      { id: 'waiting-list', icon: Clock, label: 'Waiting List', roles: ['owner', 'admin'] },
      { id: 'media', icon: ImageIcon, label: 'Photos & Gallery', roles: ['owner'] },
      { id: 'marketing', icon: MessageSquare, label: 'Marketing', roles: ['owner', 'admin'] },
      { id: 'ai-tools', icon: Sparkles, label: 'AI Tools', roles: ['owner', 'admin'] },
      { id: 'export', icon: Download, label: 'Export Data', roles: ['owner'] },
      { id: 'settings', icon: Settings, label: 'Settings', roles: ['owner', 'admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));
    console.log('🎨 SALON DASHBOARD - Menu items for role:', currentUser.role, 'Count:', filteredItems.length);
    console.log('🎨 Filtered items:', filteredItems.map(i => i.label));

    return (
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
        {/* User Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
            </div>
          </div>

          {/* Salon Switcher (for owners with multiple salons) */}
          {permissions.canViewAllSalons && (
            <div className="mb-4">
              <SalonSwitcher
                salons={salons}
                currentSalonId={currentSalonId}
                onSwitch={onSalonChange}
                onAddNew={onAddSalon}
                onManage={() => setActiveTab('my-salons')}
              />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentUser.role === 'master' ? 'My Dashboard' : 'Overview'}
              </h1>
              <p className="text-gray-600">
                {currentUser.role === 'master' 
                  ? 'View your appointments and schedule'
                  : `Welcome back, ${currentUser.firstName}! Here's what's happening today.`
                }
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-10 h-10 text-purple-600" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
                      <div className="text-xs text-gray-500">Today's Bookings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {permissions.canViewAnalytics && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-10 h-10 text-green-600" />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${stats.weekRevenue}</div>
                          <div className="text-xs text-gray-500">This Week</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Users className="w-10 h-10 text-blue-600" />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
                          <div className="text-xs text-gray-500">Total Clients</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-10 h-10 text-orange-600" />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">+{stats.growthRate}%</div>
                          <div className="text-xs text-gray-500">Growth Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">
                  {currentUser.role === 'master' ? 'My Upcoming Appointments' : 'Recent Bookings'}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No bookings to display</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {currentUser.role === 'master' 
                      ? 'Your appointments will appear here'
                      : 'New bookings will appear here'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Modules */}
            {currentUser.role !== 'master' && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-gray-900">Quick Access</h3>
                  <p className="text-sm text-gray-500">Navigate to key features</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Calendar */}
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Calendar</h3>
                      <p className="text-sm text-gray-500">Manage bookings</p>
                    </button>

                    {/* Masters */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setActiveTab('masters')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                          <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Masters</h3>
                        <p className="text-sm text-gray-500">Manage staff</p>
                      </button>
                    )}

                    {/* Clients */}
                    <button
                      onClick={() => setActiveTab('clients')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-pink-100">
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Client Database</h3>
                      <p className="text-sm text-gray-500">History & Favorites</p>
                    </button>

                    {/* Services */}
                    <button
                      onClick={() => setActiveTab('services')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-100">
                        <Scissors className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">menu/Services</h3>
                      <p className="text-sm text-gray-500">Manage services</p>
                    </button>

                    {/* Beauty Feed */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setActiveTab('beauty-feed')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-pink-100">
                          <Camera className="w-6 h-6 text-pink-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Beauty Feed</h3>
                        <p className="text-sm text-gray-500">Showcase Work</p>
                      </button>
                    )}

                    {/* Marketing */}
                    <button
                      onClick={() => setActiveTab('marketing')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Marketing</h3>
                      <p className="text-sm text-gray-500">Promote salon</p>
                    </button>

                    {/* Analytics */}
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                        <BarChart3 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-500">View reports</p>
                    </button>

                    {/* AI Tools */}
                    <button
                      onClick={() => setActiveTab('ai-tools')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-100">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">AI Tools</h3>
                      <p className="text-sm text-gray-500">Configure AI</p>
                    </button>

                    {/* Finance */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('finance')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Finance</h3>
                        <p className="text-sm text-gray-500">Manage finances</p>
                      </button>
                    )}

                    {/* Products */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setActiveTab('products')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-cyan-100">
                          <Package className="w-6 h-6 text-cyan-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">products</h3>
                        <p className="text-sm text-gray-500">manage/marketplace</p>
                      </button>
                    )}

                    {/* Salon Settings */}
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-slate-100">
                        <Settings className="w-6 h-6 text-slate-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Salon Settings</h3>
                      <p className="text-sm text-gray-500">Profile & Photos</p>
                    </button>

                    {/* Inventory */}
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-amber-100">
                        <Package className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Inventory</h3>
                      <p className="text-sm text-gray-500">Manage stock</p>
                    </button>

                    {/* Attendance */}
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-teal-100">
                        <Users className="w-6 h-6 text-teal-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Attendance</h3>
                      <p className="text-sm text-gray-500">Track staff</p>
                    </button>

                    {/* Reviews */}
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-yellow-100">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Reviews</h3>
                      <p className="text-sm text-gray-500">Manage feedback</p>
                    </button>

                    {/* Expense */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('expense')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-red-100">
                          <DollarSign className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Expense</h3>
                        <p className="text-sm text-gray-500">Track costs</p>
                      </button>
                    )}

                    {/* Loyalty */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('loyalty')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-fuchsia-100">
                          <Gift className="w-6 h-6 text-fuchsia-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Loyalty</h3>
                        <p className="text-sm text-gray-500">Reward clients</p>
                      </button>
                    )}

                    {/* Advanced Analytics */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('advanced-analytics')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-emerald-100">
                          <BarChart3 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Advanced Analytics</h3>
                        <p className="text-sm text-gray-500">Deep dive into data</p>
                      </button>
                    )}

                    {/* Feed Analytics */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('feed-analytics')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                          <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Feed Analytics</h3>
                        <p className="text-sm text-gray-500">Analyze feed performance</p>
                      </button>
                    )}

                    {/* Notifications */}
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-orange-100">
                        <Bell className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">Stay informed</p>
                    </button>

                    {/* Waiting List */}
                    <button
                      onClick={() => setActiveTab('waiting-list')}
                      className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-rose-100">
                        <Clock className="w-6 h-6 text-rose-600" />
                      </div>
                      <h3 className="font-bold mb-1 text-gray-900">Waiting List</h3>
                      <p className="text-sm text-gray-500">Manage reservations</p>
                    </button>

                    {/* Package Deals */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('package-deals')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                          <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Package Deals</h3>
                        <p className="text-sm text-gray-500">Create and manage deals</p>
                      </button>
                    )}

                    {/* Dynamic Pricing */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('dynamic-pricing')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Dynamic Pricing</h3>
                        <p className="text-sm text-gray-500">Adjust prices in real-time</p>
                      </button>
                    )}

                    {/* Referral Program */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('referral-program')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                          <UserPlus className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Referral Program</h3>
                        <p className="text-sm text-gray-500">Encourage client referrals</p>
                      </button>
                    )}

                    {/* AI Smart Filling */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('ai-smart-filling')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-100">
                          <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">AI Smart Filling</h3>
                        <p className="text-sm text-gray-500">Automate appointment scheduling</p>
                      </button>
                    )}

                    {/* Advanced Forecasting */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('advanced-forecasting')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-orange-100">
                          <Zap className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Advanced Forecasting</h3>
                        <p className="text-sm text-gray-500">Predict future trends</p>
                      </button>
                    )}

                    {/* Booking Settings */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('booking-settings')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gray-100">
                          <Settings className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Booking Settings</h3>
                        <p className="text-sm text-gray-500">Configure booking options</p>
                      </button>
                    )}

                    {/* Refresh Data */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('refresh')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gray-100">
                          <RefreshCw className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Refresh Data</h3>
                        <p className="text-sm text-gray-500">Update and refresh data</p>
                      </button>
                    )}

                    {/* Store */}
                    {currentUser.role === 'owner' && (
                      <button
                        onClick={() => setActiveTab('store')}
                        className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gray-100">
                          <Store className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="font-bold mb-1 text-gray-900">Store</h3>
                        <p className="text-sm text-gray-500">Manage store inventory</p>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'staff':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
                <p className="text-gray-600">Manage your team members and their permissions</p>
              </div>
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Staff
              </Button>
            </div>

            {/* Staff List */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Team Members ({currentSalon?.staff?.length || 0})</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentSalon?.staff?.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                      </div>
                      <div className="text-sm">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full capitalize font-medium">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'masters':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Masters & Targets</h1>
              <p className="text-gray-600">View masters performance and targets (salaries are hidden)</p>
            </div>

            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Masters Overview</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Masters & Targets</p>
                  <p className="text-sm mt-2">View master targets and performance</p>
                  <p className="text-xs mt-4 text-purple-600">⚠️ Salary information is not available for admins</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
              <p className="text-gray-600">Manage salon products</p>
              {permissions.requiresOwnerApproval && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    ⚠️ Your changes require owner approval before taking effect
                  </p>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Product Catalog</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Products Management</p>
                  <p className="text-sm mt-2">Add and manage salon products</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'beauty-feed':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Beauty Feed</h1>
              <p className="text-gray-600">Manage salon's public feed and gallery</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Feed Posts</h3>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Beauty Feed</p>
                  <p className="text-sm mt-2">Share your best work with clients</p>
                  <p className="text-xs mt-4 text-green-600">✅ Full access to create and manage feed posts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
              <p className="text-gray-600">Export and import your client database</p>
            </div>

            <DataExportImport
              clients={mockClients}
              salonName={currentSalon?.name || 'Salon'}
              onImport={handleImportClients}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <SalonSettingsTab
              salonId={currentSalon?.id}
              initialIsPublished={currentSalon?.isPublished || false}
            />
          </div>
        );

      case 'package-deals':
        return (
          <div className="space-y-6">
            <PackageDealsTab />
          </div>
        );

      case 'dynamic-pricing':
        return (
          <div className="space-y-6">
            <DynamicPricingTab />
          </div>
        );

      case 'referral-program':
        return (
          <div className="space-y-6">
            <ReferralProgramTab />
          </div>
        );

      case 'ai-smart-filling':
        return (
          <div className="space-y-6">
            <AISmartFillingTab />
          </div>
        );

      case 'advanced-forecasting':
        return (
          <div className="space-y-6">
            <AdvancedForecastingTab />
          </div>
        );

      case 'booking-settings':
        return (
          <div className="space-y-6">
            <BookingSettingsTab />
          </div>
        );

      case 'gift-cards':
        return (
          <div className="space-y-6">
            <GiftCardsTab userRole={currentUser.role} />
          </div>
        );

      case 'my-salons':
        return (
          <div className="space-y-6">
            <MultiSalonManager
              currentSalonId={currentSalonId}
              onSalonSwitch={onSalonChange}
            />
          </div>
        );

      case 'refresh':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Refreshed</h2>
              <p className="text-gray-600">Your data has been updated</p>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Management</h2>
              <p className="text-gray-600">Manage your salon's store inventory</p>
            </div>
          </div>
        );

      case 'analytics':
      case 'advanced-analytics':
        return (
          <div className="space-y-6">
            <FavoritesAnalytics
              salonId={currentSalon?.id}
              salonName={currentSalon?.name}
            />
          </div>
        );

      case 'feed-analytics':
        return (
          <div className="space-y-6">
            <FeedAnalytics
              salonId={currentSalon?.id}
              salonName={currentSalon?.name}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {renderSidebar()}
      <div className="flex-1 overflow-y-auto">
        {/* Demo Banner */}
        {isDemo && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 text-center">
            <p className="font-medium">
              🎨 Demo Mode - This is a preview of the {currentUser.role === 'owner' ? 'Owner' : currentUser.role === 'admin' ? 'Admin' : 'Master'} Dashboard with sample data
            </p>
          </div>
        )}
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {currentSalon && (
        <InviteStaffModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          salonId={currentSalon.id}
          services={currentSalon.services || []}
          onInvite={handleInviteStaff}
        />
      )}
    </div>
  );
}