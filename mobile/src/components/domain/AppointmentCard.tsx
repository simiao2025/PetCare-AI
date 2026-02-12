import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  petName: string;
  petSpecies: 'dog' | 'cat' | 'other';
  serviceType: string;
  scheduledAt: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.petName}>{appointment.petName} <Text style={styles.species}>({appointment.petSpecies})</Text></Text>
        <Text style={styles.time}>{format(appointment.scheduledAt, 'HH:mm')}</Text>
      </View>
      <Text style={styles.service}>{appointment.serviceType}</Text>
      <Text style={[styles.status, styles[appointment.status]]}>{appointment.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b'
  },
  species: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'normal'
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1'
  },
  service: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4
  },
  status: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden'
  },
  scheduled: { backgroundColor: '#e2e8f0', color: '#475569' },
  confirmed: { backgroundColor: '#dcfce7', color: '#166534' },
  completed: { backgroundColor: '#f1f5f9', color: '#94a3b8' },
  cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' }
});
