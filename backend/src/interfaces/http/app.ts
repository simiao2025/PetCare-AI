import fastify from 'fastify';
import cors from '@fastify/cors';

// Domain & Infra
import { OpenAIService } from '../../infrastructure/ai/OpenAIService.js';
import { EvolutionApiClient } from '../../infrastructure/whatsapp/EvolutionApiClient.js';
import { VeterinaryIntentClassifier } from '../../infrastructure/ai/VeterinaryIntentClassifier.js';
import { DialogStateManager } from '../../infrastructure/ai/DialogStateManager.js';
import { WhatsappWebhookHandler } from '../../infrastructure/whatsapp/WhatsappWebhookHandler.js';
import { SentryService } from '../../infrastructure/monitoring/SentryService.js';

// Routes
import { clientRoutes } from './routes/clients.js';
import { appointmentRoutes } from './routes/appointments.js';

// Logger Configuration (Pino)
const app = fastify({
  logger: true,
  disableRequestLogging: false,
});

// Middleware
app.register(cors, {
  origin: '*',
});

// Services Initialization (Dependency Injection)
const sentry = new SentryService();
const openAI = new OpenAIService();
const evolutionClient = new EvolutionApiClient();
const intentClassifier = new VeterinaryIntentClassifier(openAI);
const dialogManager = new DialogStateManager();
const whatsappHandler = new WhatsappWebhookHandler(intentClassifier, dialogManager, evolutionClient);

// Global Error Handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  sentry.captureException(error, {
    method: request.method,
    url: request.url,
    body: request.body,
  });
  
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date() };
});

// Register API Routes
app.register(clientRoutes);
app.register(appointmentRoutes);

// Register Webhook Route
app.post('/whatsapp/webhook', async (request, reply) => {
  await whatsappHandler.handleWebhook(request);
  return { status: 'received' };
});

export { app };
