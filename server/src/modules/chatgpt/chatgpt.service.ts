// server/src/modules/chatgpt/chatgpt.service.ts
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

@Injectable()
export class ChatGptService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not defined in the environment variables',
      );
    }
    this.openai = new OpenAI({ apiKey });
  }

  async getChatResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in ChatGPT API call:', error);
      throw new Error('Failed to get response from ChatGPT');
    }
  }
}
