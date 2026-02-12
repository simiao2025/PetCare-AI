export type DialogState = 
  | 'AWAITING_CONSENT'          
  | 'IDLE'                      
  | 'IDENTIFYING_PET'           
  | 'COLLECTING_SERVICE'        
  | 'CONFIRMING_APPOINTMENT';    

interface DialogContext {
  state: DialogState;
  petName?: string;
  serviceType?: string;
  lastInteraction: Date;
}

export class DialogStateManager {
  // Simulating Redis with in-memory Map
  private sessions = new Map<string, DialogContext>();

  async process(input: {
    clientId: string;
    message: string;
    intent: string;
    context: any;
  }): Promise<{ text: string }> {
    
    let session = this.sessions.get(input.clientId) || {
      state: 'AWAITING_CONSENT',
      lastInteraction: new Date()
    };

    // Update timestamp
    session.lastInteraction = new Date();

    // 1. Check Consent
    if (session.state === 'AWAITING_CONSENT') {
      if (input.message.toLowerCase().match(/(sim|aceito|ok)/)) {
        session.state = 'IDLE';
        this.sessions.set(input.clientId, session);
        return { text: '🙏 Obrigada! Como posso ajudar hoje? (Agendar consulta, vacinas, etc.)' };
      }
      return { text: 'Olá! Sou a assistente da PetCare. Para continuar, preciso que aceite receber mensagens. (Responda SIM)' };
    }

    // 2. Handle Intents based on State
    switch (session.state) {
      case 'IDLE':
        if (input.intent === 'schedule_appointment') {
          session.state = 'IDENTIFYING_PET';
          this.sessions.set(input.clientId, session);
          return { text: 'Claro! Para qual pet seria o agendamento?' };
        }
        if (input.intent === 'info_vaccination') {
          return { text: 'Nossas vacinas disponíveis são V8, V10 e Antirrábica. Deseja agendar?' };
        }
        return { text: 'Entendi. Posso ajudar com agendamentos ou dúvidas sobre vacinas.' };

      case 'IDENTIFYING_PET':
        session.petName = input.message; // Naive extraction, ideally use NER
        session.state = 'COLLECTING_SERVICE';
        this.sessions.set(input.clientId, session);
        return { text: `Certo, para o ${session.petName}. Qual serviço? (Consulta, Banho, Vacina)` };

      case 'COLLECTING_SERVICE':
        session.serviceType = input.message;
        session.state = 'CONFIRMING_APPOINTMENT';
        this.sessions.set(input.clientId, session);
        return { text: `Confirma agendamento de ${session.serviceType} para ${session.petName}? (Sim/Não)` };

      case 'CONFIRMING_APPOINTMENT':
        if (input.intent === 'affirmation') {
          session.state = 'IDLE';
          // Here we would call AppointmentService.create()
          const finalResponse = `Agendado! ${session.serviceType} para ${session.petName} confirmado. Enviarei um lembrete antes.`;
          
          // Clear context but keep consent
          session.petName = undefined;
          session.serviceType = undefined;
          this.sessions.set(input.clientId, session);
          
          return { text: finalResponse };
        }
        session.state = 'IDLE';
        this.sessions.set(input.clientId, session);
        return { text: 'Agendamento cancelado. Algo mais?' };
    }

    return { text: 'Desculpe, não entendi. Pode repetir?' };
  }
}
