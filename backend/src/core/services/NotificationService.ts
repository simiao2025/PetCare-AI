import { EvolutionApiClient } from '../../infrastructure/whatsapp/EvolutionApiClient.js';
import { MobileNotificationService } from '../../infrastructure/mobile/MobileNotificationService.js';

export class NotificationService {
  constructor(
    private whatsappClient: EvolutionApiClient,
    private mobilePush: MobileNotificationService
  ) {}

  async sendAppointmentReminder(clientPhone: string, pushToken: string | null, petName: string, date: Date) {
    const formattedDate = date.toLocaleString('pt-BR');
    const message = `Olá! Lembrete do agendamento para ${petName} em ${formattedDate}. Por favor, chegue com 10 minutos de antecedência.`;
    
    // Send via WhatsApp
    console.log(`[Notification] Sending WhatsApp reminder to ${clientPhone}`);
    await this.whatsappClient.sendText(clientPhone, message);

    // Send via Push (if token exists)
    if (pushToken) {
       await this.mobilePush.sendPush(pushToken, 'Lembrete de Consulta', `Sua consulta para ${petName} é amanhã às ${formattedDate}.`);
    }
  }

  async sendPromotionalMessage(clientPhone: string, message: string) {
    console.log(`[Notification] Sending promo to ${clientPhone}: ${message}`);
    await this.whatsappClient.sendText(clientPhone, message);
  }
}
