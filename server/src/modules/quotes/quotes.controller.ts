import { Controller, Post, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes/bot')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('telegram-webhook')
  async handleTelegramWebhook(@Body() update: any): Promise<any> {
    try {
      // Log the incoming update (this can be customized to process specific messages)
      console.log('Received update from Telegram:', update);

      // You can add logic here to process the update if needed
      // For example, you can send responses based on the message content

      return { success: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      return { success: false, error: error.message };
    }
  }
}
