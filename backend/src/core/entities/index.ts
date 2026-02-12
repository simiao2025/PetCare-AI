// Client.ts
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  gdprConsent: boolean;
  gdprConsentAt?: Date;
}

// Pet.ts
export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: Date;
  weightKg?: number;
  photoUrl?: string;
  medicalHistory: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment.ts
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type ServiceType = 'consultation' | 'vaccination' | 'bath' | 'grooming' | 'surgery' | 'emergency';

export interface Appointment {
  id: string;
  petId: string;
  professionalId?: string;
  serviceType: ServiceType;
  scheduledAt: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  whatsappThreadId?: string;
  createdAt: Date;
  updatedAt: Date;
}
