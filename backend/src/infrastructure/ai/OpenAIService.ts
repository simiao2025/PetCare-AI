import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async classifyIntent(message: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um assistente veterinário. Classifique a intenção da mensagem do usuário em uma das seguintes categorias:
            - schedule_appointment (agendar consulta/banho)
            - cancel_appointment (cancelar agendamento)
            - info_vaccination (dúvidas sobre vacinas)
            - affirmation (sim/confirmar)
            - negation (não/negar)
            - unknown (não entendi)
            
            Responda APENAS com a categoria.`
          },
          { role: "user", content: message }
        ],
        temperature: 0,
        max_tokens: 10
      });

      return response.choices[0]?.message?.content?.trim() || 'unknown';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return 'unknown';
    }
  }

  async generateResponse(intent: string, context: any): Promise<string> {
    //TODO: Implementar geração de resposta humanizada baseada no contexto
    return "Olá! Como posso ajudar seu pet hoje?";
  }
}
