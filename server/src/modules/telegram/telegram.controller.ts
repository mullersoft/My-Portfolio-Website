import { Controller, Post, Body, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegramwebhook')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // Endpoint to handle incoming messages
  @Post()
  async handleIncomingMessages(@Body() body: any): Promise<void> {
    console.log('Received update:', body); // Log the incoming request for debugging

    if (body.message && body.message.chat.type === 'private') {
      const chatId = body.message.chat.id;
      const userName = body.message.from.first_name || 'there';
      const userMessage = body.message.text;

      // Check your availability status
      const isAvailable = this.telegramService.getAvailability();
      console.log(
        `Availability status: ${isAvailable ? 'Active' : 'Inactive'}`,
      );

      if (isAvailable) {
        // You're active, no bot response
        console.log(
          `User message ignored because you're active: ${userMessage}`,
        );
      } else {
        // You're inactive, bot responds
        const responseMessage = `
          Hi ${userName}, Mulugeta is not available right now.
          You can:
          - Call: 0947300026
          - Contact on Facebook: www.facebook.com/mullersoft
          - Email: mulerselinger@gmail.com
        `;
        await this.telegramService.sendMessageToUser(chatId, responseMessage);
      }
    } else {
      console.log('Received non-private message or no message in body.');
    }
  }

  // Endpoint to toggle availability
  @Get('toggle-availability')
  toggleAvailability(): string {
    this.telegramService.toggleAvailability();
    return `Availability toggled. Current status: ${
      this.telegramService.getAvailability() ? 'Active' : 'Inactive'
    }`;
  }
}
