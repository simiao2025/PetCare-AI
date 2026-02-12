import { db } from '../database/connection.js';
import { Client } from '../../core/entities.js';

export class ClientRepository {
  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const query = `
      INSERT INTO clients (name, phone, email, address, gdpr_consent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [client.name, client.phone, client.email, client.address, client.gdprConsent];
    const result = await db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const query = `SELECT * FROM clients WHERE phone = $1`;
    const result = await db.query(query, [phone]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  private mapToEntity(row: any): Client {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      gdprConsent: row.gdpr_consent,
      gdprConsentAt: row.gdpr_consent_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
