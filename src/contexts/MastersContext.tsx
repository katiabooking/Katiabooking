import { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isWorking: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Vacation {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface ExtraWorkDay {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export interface Master {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  role: 'master' | 'admin'; // Master or Admin role
  categories: string[]; // Categories the master works in
  services: string[]; // Specific service IDs the master can perform
  workingHours: WorkingHours[];
  daysOff: string[]; // Days of week: ['monday', 'sunday']
  vacations: Vacation[];
  extraWorkDays: ExtraWorkDay[];
  rating?: number;
  completedBookings?: number;
  revenue?: number;
  // Financial fields
  baseSalary: number; // Fixed monthly salary
  monthlyTarget: number; // Target revenue for the month
  currentRevenue: number; // Current revenue for the month
  bonusType: 'percentage' | 'fixed'; // Type of bonus when target is achieved
  bonusValue: number; // Percentage (e.g., 10 for 10%) or fixed amount (e.g., 500)
}

interface MastersContextType {
  masters: Master[];
  addMaster: (master: Master) => void;
  updateMaster: (master: Master) => void;
  deleteMaster: (id: string) => void;
  getMasterById: (id: string) => Master | undefined;
  getMastersByCategory: (category: string) => Master[];
  getMastersByService: (serviceId: string) => Master[];
  isMasterAvailable: (masterId: string, date: Date) => boolean;
  getMasterWorkingHours: (masterId: string, date: Date) => { startTime: string; endTime: string } | null;
}

const MastersContext = createContext<MastersContextType | undefined>(undefined);

export function MastersProvider({ children }: { children: ReactNode }) {
  const [masters, setMasters] = useState<Master[]>([
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Kowalska',
      phone: '+48 123 456 789',
      email: 'anna.kowalska@salon.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      role: 'master',
      categories: ['Manicure', 'Pedicure'],
      services: ['3', '4'], // Manicure, Pedicure service IDs
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'friday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'saturday', isWorking: true, startTime: '10:00', endTime: '16:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 4.9,
      completedBookings: 245,
      revenue: 12450,
      baseSalary: 3000,
      monthlyTarget: 15000,
      currentRevenue: 12450,
      bonusType: 'percentage',
      bonusValue: 10
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Nowak',
      phone: '+48 987 654 321',
      email: 'maria.nowak@salon.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      role: 'master',
      categories: ['Hair stylist', 'Make up'],
      services: ['1', '5', '11'], // Haircut, Full Color, Makeup
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'tuesday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'wednesday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'thursday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'friday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'saturday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 4.8,
      completedBookings: 189,
      revenue: 10230,
      baseSalary: 3500,
      monthlyTarget: 16000,
      currentRevenue: 10230,
      bonusType: 'percentage',
      bonusValue: 10
    },
    {
      id: '3',
      firstName: 'Ewa',
      lastName: 'Wiśniewska',
      phone: '+48 555 123 456',
      email: 'ewa.wisniewska@salon.com',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      role: 'master',
      categories: ['Eyelashes', 'Brow'],
      services: ['7', '9'], // Eyelash Extensions, Eyebrow Shaping
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'friday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'saturday', isWorking: false, startTime: '00:00', endTime: '00:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['saturday', 'sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 5.0,
      completedBookings: 312,
      revenue: 15600,
      baseSalary: 4000,
      monthlyTarget: 17000,
      currentRevenue: 15600,
      bonusType: 'percentage',
      bonusValue: 10
    }
  ]);

  const addMaster = (master: Master) => {
    setMasters([...masters, master]);
  };

  const updateMaster = (updatedMaster: Master) => {
    setMasters(masters.map(master => 
      master.id === updatedMaster.id ? updatedMaster : master
    ));
  };

  const deleteMaster = (id: string) => {
    setMasters(masters.filter(master => master.id !== id));
  };

  const getMasterById = (id: string) => {
    return masters.find(master => master.id === id);
  };

  const getMastersByCategory = (category: string) => {
    return masters.filter(master => master.categories.includes(category));
  };

  const getMastersByService = (serviceId: string) => {
    return masters.filter(master => master.services.includes(serviceId));
  };

  const isMasterAvailable = (masterId: string, date: Date): boolean => {
    const master = getMasterById(masterId);
    if (!master) return false;

    // Check if date is in vacation period
    const isOnVacation = master.vacations.some(vacation => {
      const vacationStart = new Date(vacation.startDate);
      const vacationEnd = new Date(vacation.endDate);
      return date >= vacationStart && date <= vacationEnd;
    });

    if (isOnVacation) return false;

    // Get day of week
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

    // Check if it's an extra work day
    const hasExtraWorkDay = master.extraWorkDays.some(extraDay => {
      const extraDate = new Date(extraDay.date);
      return extraDate.toDateString() === date.toDateString();
    });

    if (hasExtraWorkDay) return true;

    // Check if it's a regular working day
    const workingDay = master.workingHours.find(wh => wh.day === dayOfWeek);
    return workingDay ? workingDay.isWorking : false;
  };

  const getMasterWorkingHours = (masterId: string, date: Date): { startTime: string; endTime: string } | null => {
    const master = getMasterById(masterId);
    if (!master || !isMasterAvailable(masterId, date)) return null;

    // Check for extra work day first
    const extraWorkDay = master.extraWorkDays.find(extraDay => {
      const extraDate = new Date(extraDay.date);
      return extraDate.toDateString() === date.toDateString();
    });

    if (extraWorkDay) {
      return {
        startTime: extraWorkDay.startTime,
        endTime: extraWorkDay.endTime
      };
    }

    // Get regular working hours
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    const workingDay = master.workingHours.find(wh => wh.day === dayOfWeek);

    if (workingDay && workingDay.isWorking) {
      return {
        startTime: workingDay.startTime,
        endTime: workingDay.endTime
      };
    }

    return null;
  };

  return (
    <MastersContext.Provider
      value={{
        masters,
        addMaster,
        updateMaster,
        deleteMaster,
        getMasterById,
        getMastersByCategory,
        getMastersByService,
        isMasterAvailable,
        getMasterWorkingHours
      }}
    >
      {children}
    </MastersContext.Provider>
  );
}

export function useMasters() {
  const context = useContext(MastersContext);
  if (context === undefined) {
    throw new Error('useMasters must be used within a MastersProvider');
  }
  return context;
}