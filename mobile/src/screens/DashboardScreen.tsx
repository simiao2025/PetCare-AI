import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock Feather icons replacement since we don't have the lib installed in this environment context but code expects it
// In a real env, this would be: import { Feather } from '@expo/vector-icons';
const Feather = ({ name, size, color }: any) => <Text style={{fontSize: size, color}}>{name}</Text>;

interface Appointment {
  id: string;
  petName: string;
  petSpecies: 'dog' | 'cat' | 'other';
  serviceType: string;
  scheduledAt: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { appointments, fetchTodaysAppointments, user } = useAppStore();
  
  useEffect(() => {
    fetchTodaysAppointments();
  }, [fetchTodaysAppointments]);

  // Cálculo de ocupação (regra de negócio crítica)
  const occupancyRate = calculateOccupancy(appointments);
  const nextAppointment = appointments
    .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header com ocupação */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bom dia, {user?.name} 👋</Text>
        <View style={styles.occupancyCard}>
          <View style={styles.occupancyMeter}>
            <View 
              style={[styles.occupancyFill, { width: `${occupancyRate}%` }]} 
            />
          </View>
          <Text style={styles.occupancyText}>
            {occupancyRate}% ocupado hoje • {appointments.length} atendimentos
          </Text>
        </View>
      </View>

      {/* Próximo atendimento */}
      {nextAppointment && (
        <TouchableOpacity style={styles.nextAppointment}>
          <View style={styles.nextAppointmentIcon}>
            <Feather name="clock" size={24} color="#6366f1" />
          </View>
          <View style={styles.nextAppointmentContent}>
            <Text style={styles.nextAppointmentTitle}>Próximo em breve</Text>
            <Text style={styles.nextAppointmentPet}>
              {nextAppointment.petName} • {nextAppointment.serviceType}
            </Text>
            <Text style={styles.nextAppointmentTime}>
              {format(new Date(nextAppointment.scheduledAt), 'HH:mm', { locale: ptBR })}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Lista de agendamentos */}
      <ScrollView style={styles.appointmentsList}>
        <Text style={styles.sectionTitle}>Hoje</Text>
        {appointments.map(appointment => (
          <AppointmentCard 
            key={appointment.id} 
            appointment={appointment} 
          />
        ))}
        {appointments.length === 0 && <Text style={styles.emptyState}>Sem agendamentos.</Text>}
      </ScrollView>

      {/* Botão de emergência fixo - One Thumb Action */}
      <TouchableOpacity style={styles.emergencyButton}>
        <Feather name="alert-triangle" size={20} color="#fff" />
        <Text style={styles.emergencyButtonText}>Emergência</Text>
      </TouchableOpacity>
    </View>
  );
}

function calculateOccupancy(appointments: Appointment[]): number {
  if (!appointments.length) return 0;
  const businessHours = { start: 8, end: 18 }; // 8h às 18h
  const totalMinutes = (businessHours.end - businessHours.start) * 60;
  
  const occupiedMinutes = appointments.reduce((sum, appt) => {
    const apptDate = new Date(appt.scheduledAt);
    const hour = apptDate.getHours();
    if (hour >= businessHours.start && hour < businessHours.end) {
      return sum + (appt.serviceType === 'surgery' ? 60 : 30);
    }
    return sum;
  }, 0);

  return Math.min(100, Math.round((occupiedMinutes / totalMinutes) * 100));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  occupancyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  occupancyMeter: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  occupancyFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  occupancyText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  nextAppointment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  nextAppointmentIcon: {
    backgroundColor: '#bfdbfe',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nextAppointmentContent: {
    flex: 1,
  },
  nextAppointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  nextAppointmentPet: {
    fontSize: 14,
    color: '#334155',
    marginVertical: 4,
  },
  nextAppointmentTime: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  emptyState: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 32,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
