import axios, { AxiosInstance } from 'axios';

export class EvolutionApiClient {
  private client: AxiosInstance;
  private instanceName: string;

  constructor() {
    this.instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'petcare';
    this.client = axios.create({
      baseURL: process.env.EVOLUTION_API_URL,
      headers: {
        'apikey': process.env.EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  }

  async sendText(phone: string, text: string): Promise<void> {
    try {
      // Formatar telefone para padrão BR se necessário (55 + DDD + Numero)
      const number = phone.replace(/\D/g, ''); 
      
      await this.client.post(`/message/sendText/${this.instanceName}`, {
        number,
        options: {
          delay: 1200,
          presence: "composing",
        },
        textMessage: {
          text
        }
      });
    } catch (error) {
      console.error('Error sending WhatsApp message via Evolution API:', error);
      // Não jogar erro para não travar o fluxo, apenas logar
    }
  }
}
