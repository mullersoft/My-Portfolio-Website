// telegram.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('webhook')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async handleIncomingMessages(@Body() body: any): Promise<void> {
    console.log('Received update:', body);

    // Check if the message is from a private chat
    if (body.message && body.message.chat.type === 'private') {
      const chatId = body.message.chat.id; // User's chat ID
      const userName = body.message.from.first_name || 'there'; // User's first name
      const userMessage = body.message.text; // Message text

      // Respond based on the user's message
      if (userMessage === '/start') {
        const welcomeMessage = `Hello ${userName}! Welcome to @yourAssessmentBot. How can I assist you today?`;
        await this.telegramService.sendMessageToUser(chatId, welcomeMessage);
      } else {
        const responseMessage = `Hi ${userName}, you said: "${userMessage}". How can I help you further?`;
        await this.telegramService.sendMessageToUser(chatId, responseMessage);
      }
    }
  }
}
