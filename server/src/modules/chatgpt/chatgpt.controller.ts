// server/src/modules/chatgpt/chatgpt.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatGptService } from './chatgpt.service';

@Controller('chatgpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post('ask')
  async askQuestion(@Body() body: { prompt: string }) {
    const { prompt } = body;
    const response = await this.chatGptService.getChatResponse(prompt);
    return { answer: response }; // Send back the answer to the frontend
  }
}
