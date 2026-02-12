import { OpenAIService } from './OpenAIService.js';

export class VeterinaryIntentClassifier {
  constructor(private openAI: OpenAIService) {}

  async classify(message: string, clientId: string): Promise<string> {
    return this.openAI.classifyIntent(message);
  }
}
