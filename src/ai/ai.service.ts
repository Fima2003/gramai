import { Injectable } from '@nestjs/common';
import axios from 'axios';
// const axios = require('axios').default;

@Injectable()
export class AiService {
  async generateText(prompt: string, system: string) {
    const options = {
      method: 'POST',
      url: 'https://api.edenai.run/v2/text/generation',
      headers: {
        authorization:
          `Bearer ${process.env.EDEN_BEARER}`,
      },
      data: {
        response_as_dict: true,
        providers: ['openai'],
        fallback_providers: ['amazon,cohere'],
        text: 'this is a test',
        temperature: 0.2,
        max_tokens: 250,
      },
    };

    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async generatePrompt(text: string, links: string[]) {}
}
