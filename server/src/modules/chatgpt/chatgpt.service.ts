import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ChatGptService {
  private readonly apiKey = process.env.HUGGINGFACE_API_KEY;
  private readonly apiUrl =
    'https://api-inference.huggingface.co/models/google/flan-t5-base';

  async getChatResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data[0]?.generated_text || 'No response.';
    } catch (error) {
      console.error(
        'HuggingFace API Error:',
        error.response?.data || error.message,
      );
      return 'Sorry, the AI service is currently unavailable.';
    }
  }
}
