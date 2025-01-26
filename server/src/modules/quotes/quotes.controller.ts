import { Controller, Post, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes/bot')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('telegram-webhook')
  async handleTelegramWebhook(@Body() update: any): Promise<any> {
    try {
      // Log the incoming update
      console.log('Received update from Telegram:', update);

      const message = update.message;
      if (!message || !message.text) {
        return { success: true }; // Ignore updates without text
      }

      const chatId = message.chat.id;
      const text = message.text.trim();

      // Handle commands
      if (text === '/start') {
        await this.quotesService.sendMessageToTelegram(
          chatId,
          'Welcome to the Daily Quotes & Motivational Speeches Bot! 🌟\n\nYou can use the following commands:\n/start - Start the bot\n/help - Get help\n/contact - Contact us',
        );
      } else if (text === '/help') {
        await this.quotesService.sendMessageToTelegram(
          chatId,
          'Here are the available commands:\n/start - Start the bot\n/help - Get help\n/contact - Contact us\n\nYou will also receive daily quotes and motivational speeches.',
        );
      } else if (text === '/contact') {
        await this.quotesService.sendMessageToTelegram(
          chatId,
          '📩 Contact Us:\n\nIf you have any questions or feedback, please reach out to us at @mulersoft.',
        );
      } else {
        // Default response for unknown commands
        await this.quotesService.sendMessageToTelegram(
          chatId,
          "Sorry, I didn't understand that command. Type /help to see the available commands.",
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      return { success: false, error: error.message };
    }
  }
}
