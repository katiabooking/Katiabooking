import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { ServicesProvider } from '../contexts/ServicesContext';
import { MastersProvider } from '../contexts/MastersContext';
import { BookingsProvider } from '../contexts/BookingsContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MobileBottomNav } from './components/MobileBottomNav';
import { registerServiceWorker, initInstallPrompt } from '../utils/pwaUtils';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { SalonRegisterPage } from './pages/SalonRegisterPage';
import { BecomePartnerPage } from './pages/BecomePartnerPage';
import { AuthPage } from './pages/AuthPage';
import { ContactPage } from './pages/ContactPage';
import { SalonListingPage } from './pages/SalonListingPage';
import { PublicFeedPage } from './components/PublicFeedPage';
import { DashboardSelector } from './pages/DashboardSelector';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { MasterDashboard } from './pages/MasterDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { SuperAdminLeadsPage } from './pages/SuperAdminLeadsPage';
import { BlockedSalonDemo } from './pages/BlockedSalonDemo';
import { SalonProfilePage } from './pages/SalonProfilePage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { RoleBasedRedirect } from './pages/RoleBasedRedirect';
import { TestDemo } from './pages/TestDemo';
import { UpgradeDemo } from './pages/UpgradeDemo';
import 'slick-carousel/slick/slick.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export default function App() {
  useEffect(() => {
    // Инициализация PWA
    const initPWA = async () => {
      try {
        const registration = await registerServiceWorker();
        
        if (registration) {
          console.log('✅ Katia PWA активирована');
          console.log('   • Offline режим: включен');
          console.log('   • Кеширование: активно');
          console.log('   • Быстрая загрузка: готово');
        }
        
        initInstallPrompt();
      } catch (error) {
        // Тихо игнорируем - PWA опциональный
      }
    };

    initPWA();

    // Логирование режима работы
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 Katia запущена как установленное приложение');
    } else {
      console.log('🌐 Katia запущена в браузере');
    }
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <CurrencyProvider>
          <ServicesProvider>
            <MastersProvider>
              <BookingsProvider>
                <NotificationsProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Toaster position="top-right" richColors />
                    <ConnectionStatus />
                    <PWAInstallBanner />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/register" element={<SalonRegisterPage />} />
                      <Route path="/partner" element={<BecomePartnerPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/support" element={<ContactPage />} />
                      <Route path="/salons" element={<SalonListingPage />} />
                      <Route path="/feed" element={<PublicFeedPage />} />
                      <Route path="/dashboard" element={<DashboardSelector />} />
                      <Route path="/owner" element={<OwnerDashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/client" element={<ClientDashboard />} />
                      <Route path="/master" element={<MasterDashboard />} />
                      <Route path="/superadmin" element={<SuperAdminDashboard />} />
                      <Route path="/superadmin/leads" element={<SuperAdminLeadsPage />} />
                      <Route path="/salon/:salonId" element={<SalonProfilePage />} />
                      <Route path="/salon/:salonId/book" element={<BookingFlowPage />} />
                      <Route path="/booking/:salonId/:serviceId" element={<BookingFlowPage />} />
                      <Route path="/redirect" element={<RoleBasedRedirect />} />
                      <Route path="/test" element={<TestDemo />} />
                      <Route path="/upgrade" element={<UpgradeDemo />} />
                      <Route path="/blocked-demo" element={<BlockedSalonDemo />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <MobileBottomNav />
                  </div>
                </NotificationsProvider>
              </BookingsProvider>
            </MastersProvider>
          </ServicesProvider>
        </CurrencyProvider>
      </AuthProvider>
    </HashRouter>
  );
}