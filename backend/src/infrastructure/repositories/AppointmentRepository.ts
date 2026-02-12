import { db } from '../database/connection.js';
import { Appointment } from '../../core/entities/index.js';

export class AppointmentRepository {
  async create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const query = `
      INSERT INTO appointments (pet_id, service_type, scheduled_at, duration_minutes, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      appointment.petId,
      appointment.serviceType,
      appointment.scheduledAt,
      appointment.durationMinutes,
      appointment.status,
      appointment.notes
    ];
    const result = await db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findAllToday(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = `
      SELECT a.*, p.name as pet_name, p.species as pet_species
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      WHERE a.scheduled_at >= $1 AND a.scheduled_at < $2
      ORDER BY a.scheduled_at ASC
    `;
    const result = await db.query(query, [today, tomorrow]);
    return result.rows.map((row: any) => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Appointment {
    return {
      id: row.id,
      petId: row.pet_id,
      professionalId: row.professional_id,
      serviceType: row.service_type,
      scheduledAt: row.scheduled_at,
      durationMinutes: row.duration_minutes,
      status: row.status,
      notes: row.notes,
      whatsappThreadId: row.whatsapp_thread_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Augmented fields from joins (optional in entity, useful for UI)
      // @ts-ignore
      petName: row.pet_name,
      // @ts-ignore
      petSpecies: row.pet_species
    };
  }
}
