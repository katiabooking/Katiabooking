import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SalonDashboard } from '../components/SalonDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { User, Salon } from '../../types/roles';

export function OwnerDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [currentSalonId, setCurrentSalonId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('OwnerDashboard useEffect - isDemo:', isDemo, 'authLoading:', authLoading);
    
    if (isDemo) {
      loadDemoData();
      return;
    }

    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    loadOwnerData();
  }, [isDemo, authLoading, user]);

  const loadDemoData = () => {
    console.log('Loading demo data for Owner Dashboard');
    
    const mockUser: User = {
      id: 'demo-owner-id',
      email: 'owner@demo.com',
      firstName: 'Maria',
      lastName: 'Johnson',
      role: 'owner',
      salonId: 'demo-salon-1',
      createdAt: new Date(),
    };

    const mockSalons: Salon[] = [
      {
        id: 'demo-salon-1',
        name: 'Glamour Beauty Studio',
        address: '123 Main St, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'owner@demo.com',
        ownerId: 'demo-owner-id',
        logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300',
        photos: [],
        services: [],
        staff: [],
        isPublished: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date(),
      },
      {
        id: 'demo-salon-2',
        name: 'Elegance Spa & Beauty',
        address: '456 Park Ave, Brooklyn, NY 11201',
        phone: '+1 (555) 987-6543',
        email: 'owner@demo.com',
        ownerId: 'demo-owner-id',
        logo: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=300',
        photos: [],
        services: [],
        staff: [],
        isPublished: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date(),
      },
    ];

    setCurrentUser(mockUser);
    setSalons(mockSalons);
    setCurrentSalonId(mockSalons[0].id);
    setLoading(false);
  };

  const loadOwnerData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading owner data for user:', user.id);

      // Получаем данные владельца из таблицы owners
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (ownerError) {
        console.error('Error fetching owner:', ownerError);
        
        if (ownerError.code === 'PGRST116') {
          // Запись не найдена - создаём нового owner
          console.log('Owner not found, creating new record...');
          
          const newOwner = await createOwnerRecord(user);
          if (newOwner) {
            setCurrentUser(mapOwnerToUser(newOwner));
            // Создаём пустой салон-заглушку
            const defaultSalon = createDefaultSalon(newOwner);
            setSalons([defaultSalon]);
            setCurrentSalonId(defaultSalon.id);
          } else {
            toast.error('Failed to create owner profile');
            navigate('/pricing');
            return;
          }
        } else {
          toast.error('Failed to load owner data');
          navigate('/');
          return;
        }
      } else if (ownerData) {
        console.log('Owner data loaded:', ownerData);
        
        // Устанавливаем данные пользователя
        setCurrentUser(mapOwnerToUser(ownerData));
        
        // Обновляем last_active_at
        await supabase
          .from('owners')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', ownerData.id);

        // Получаем салоны владельца из таблицы salons (если есть)
        const { data: salonsData, error: salonsError } = await supabase
          .from('salons')
          .select('*')
          .eq('owner_id', user.id);

        if (salonsError) {
          console.log('No salons table or error:', salonsError);
          // Если таблицы salons нет - создаём салон из данных owner
          const defaultSalon = createDefaultSalon(ownerData);
          setSalons([defaultSalon]);
          setCurrentSalonId(defaultSalon.id);
        } else if (salonsData && salonsData.length > 0) {
          const mappedSalons = salonsData.map(mapSalonData);
          setSalons(mappedSalons);
          setCurrentSalonId(mappedSalons[0].id);
        } else {
          // Нет салонов - создаём из данных owner
          const defaultSalon = createDefaultSalon(ownerData);
          setSalons([defaultSalon]);
          setCurrentSalonId(defaultSalon.id);
        }
      }
    } catch (error) {
      console.error('Error loading owner data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Создание записи owner для нового пользователя
  const createOwnerRecord = async (authUser: any) => {
    try {
      const names = (authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Owner').split(' ');
      
      const newOwner = {
        user_id: authUser.id,
        first_name: names[0] || 'Owner',
        last_name: names.slice(1).join(' ') || '',
        email: authUser.email || '',
        phone: authUser.user_metadata?.phone || null,
        role: 'owner',
        is_active: true,
      };

      const { data, error } = await supabase
        .from('owners')
        .insert(newOwner)
        .select()
        .single();

      if (error) {
        console.error('Error creating owner:', error);
        return null;
      }

      console.log('Owner created:', data);
      return data;
    } catch (error) {
      console.error('Error in createOwnerRecord:', error);
      return null;
    }
  };

  // Маппинг данных owner в формат User
  const mapOwnerToUser = (owner: any): User => ({
    id: owner.user_id || owner.id,
    email: owner.email,
    firstName: owner.first_name,
    lastName: owner.last_name || '',
    role: owner.role || 'owner',
    salonId: owner.id, // используем id owner как salonId временно
    createdAt: new Date(owner.created_at),
  });

  // Маппинг данных salon из БД в интерфейс Salon
  const mapSalonData = (salon: any): Salon => ({
    id: salon.id,
    name: salon.name,
    address: salon.address || '',
    phone: salon.phone || '',
    email: salon.email || '',
    logo: salon.logo || undefined,
    photos: salon.photos || [],
    ownerId: salon.owner_id,
    services: salon.services || [],
    staff: salon.staff || [],
    isPublished: salon.is_published || false,
    publishedAt: salon.published_at || null,
    createdAt: new Date(salon.created_at),
  });

  // Создание салона по умолчанию из данных owner
  const createDefaultSalon = (owner: any): Salon => ({
    id: `salon_${owner.id}`,
    name: `${owner.first_name}'s Salon`,
    address: '',
    phone: owner.phone || '',
    email: owner.email || '',
    logo: owner.logo || undefined,
    photos: [],
    ownerId: owner.user_id,
    services: [],
    staff: [],
    isPublished: false,
    publishedAt: null,
    createdAt: new Date(owner.created_at),
  });

  const handleSalonChange = (salonId: string) => {
    setCurrentSalonId(salonId);
  };

  const handleAddSalon = () => {
    navigate('/pricing');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Loading states
  if (!isDemo && authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your salon dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Owner Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find your owner profile. Please complete the registration process.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <SalonDashboard
      currentUser={currentUser}
      salons={salons}
      currentSalonId={currentSalonId}
      onSalonChange={handleSalonChange}
      onAddSalon={handleAddSalon}
      onLogout={handleLogout}
      isDemo={isDemo}
    />
  );
}