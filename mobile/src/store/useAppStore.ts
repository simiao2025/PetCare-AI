import { create } from 'zustand';
import { api } from '../services/api';

interface Appointment {
  id: string;
  petName: string;
  petSpecies: 'dog' | 'cat' | 'other';
  serviceType: string;
  scheduledAt: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
}

interface AppState {
  user: User | null;
  appointments: Appointment[];
  setUser: (user: User | null) => void;
  fetchTodaysAppointments: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: { id: '1', name: 'Dra. Carolina' }, // Auth integration coming next
  appointments: [],
  setUser: (user) => set({ user }),
  fetchTodaysAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      // Ensure dates are parsed correctly if needed, or handle in component
      set({ appointments: response.data });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  },
}));
