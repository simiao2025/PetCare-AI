import { FastifyInstance } from 'fastify';
import { ClientRepository } from '../../infrastructure/repositories/ClientRepository.js';
import { z } from 'zod';

const clientRepo = new ClientRepository();

export async function clientRoutes(app: FastifyInstance) {
  app.post('/clients', async (request, reply) => {
    const schema = z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string().email().optional(),
      address: z.string().optional(),
      gdprConsent: z.boolean().default(false),
    });

    const data = schema.parse(request.body);
    
    // Check duplication
    const existing = await clientRepo.findByPhone(data.phone);
    if (existing) {
      return reply.status(409).send({ error: 'Client already exists' });
    }

    const client = await clientRepo.create(data);
    return reply.status(201).send(client);
  });
}
