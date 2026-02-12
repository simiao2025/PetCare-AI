import { FastifyInstance } from 'fastify';
import { AppointmentRepository } from '../../infrastructure/repositories/AppointmentRepository';
import { z } from 'zod';

const appointmentRepo = new AppointmentRepository();

export async function appointmentRoutes(app: FastifyInstance) {
  app.get('/appointments', async (request, reply) => {
    // Basic filter: get today's appointments
    const appointments = await appointmentRepo.findAllToday();
    return appointments;
  });

  app.post('/appointments', async (request, reply) => {
    const schema = z.object({
      petId: z.string().uuid(),
      serviceType: z.enum(['consultation', 'vaccination', 'bath', 'grooming', 'surgery', 'emergency']),
      scheduledAt: z.string().datetime(),
      durationMinutes: z.number().default(30),
      status: z.enum(['scheduled', 'confirmed']).default('scheduled'),
      notes: z.string().optional(),
    });

    const data = schema.parse(request.body);
    
    // TODO: Validate pet existence and time slot availability

    const appointment = await appointmentRepo.create({
        ...data,
        scheduledAt: new Date(data.scheduledAt)
    });
    return reply.status(201).send(appointment);
  });
}
