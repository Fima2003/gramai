import { Injectable } from '@nestjs/common';
import axios from 'axios';
// const axios = require('axios').default;

@Injectable()
export class AiService {
  async generateText(
    prompt: string,
    system: string,
    positive_keys: string[],
    negative_keys: string[],
    language: string,
    sources: string[],
  ): Promise<any> {
    const options = {
      method: 'POST',
      url: 'https://api.edenai.run/v2/text/generation',
      headers: {
        authorization: `Bearer ${process.env.EDEN_BEARER}`,
      },
      data: {
        response_as_dict: true,
        providers: ['openai'],
        fallback_providers: ['amazon,cohere'],
        text: this.generatePrompt(
          prompt,
          language,
          positive_keys,
          negative_keys,
          sources,
        ),
        chatbot_global_action: system,
        temperature: 0.2,
        max_tokens: 250,
      },
    };

    const response = await axios.request(options).catch((error) => {
      throw new Error(error);
    });
    return response.data.openai.generated_text.trim();
  }

  generatePrompt(
    prompt: string,
    language: string,
    positive_keys: string[],
    negative_keys: string[],
    source: string[],
  ): string {
    return `Give me an answer for the following prompt: ${prompt}.\n\nPositive keys: ${positive_keys.join(',')}\nNegative keys: ${negative_keys.join(', ')}\nLanguage: ${language}\nSources: ${source.join(', ')}`;
  }
}
