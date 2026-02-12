import { FastifyRequest } from 'fastify';
import { VeterinaryIntentClassifier } from '../ai/VeterinaryIntentClassifier.js';
import { DialogStateManager } from '../ai/DialogStateManager.js';
import { EvolutionApiClient } from './EvolutionApiClient.js';

export class WhatsappWebhookHandler {
  constructor(
    private intentClassifier: VeterinaryIntentClassifier,
    private dialogManager: DialogStateManager,
    private whatsappClient: EvolutionApiClient
  ) {}

  async handleWebhook(request: FastifyRequest) {
    const body: any = request.body;

    // Validação básica do payload da Evolution API
    if (body.event !== 'messages.upsert') return;
    
    const messageData = body.data;
    if (!messageData || messageData.key.fromMe) return;

    try {
      const remoteJid = messageData.key.remoteJid; // ex: 5511999999999@s.whatsapp.net
      const phone = remoteJid.split('@')[0];
      const name = messageData.pushName || 'Cliente';
      
      // Extrair texto (pode vir em conversation ou extendedTextMessage)
      const text = messageData.message?.conversation || 
                   messageData.message?.extendedTextMessage?.text;

      if (!text) return;

      console.log(`[WA] Recebido de ${name} (${phone}): ${text}`);

      // 1. Identificar cliente (Mock)
      const client = { id: 'mock-client-id', lastPetId: 'mock-pet-id' };

      // 2. Classificar intenção com GPT-4o mini
      const intent = await this.intentClassifier.classify(text, client.id);
      console.log(`[AI] Intenção identificada: ${intent}`);

      // 3. Gerenciar estado
      const response = await this.dialogManager.process({
        clientId: client.id,
        message: text,
        intent,
        context: { lastPetId: client.lastPetId }
      });

      // 4. Enviar resposta via Evolution API
      await this.whatsappClient.sendText(phone, response.text);

    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }
}
