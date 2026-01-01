import { Controller, Post, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes/bot')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('telegram-webhook')
  async handleTelegramWebhook(@Body() update: any) {
    try {
      const message = update.message;

      if (!message || !message.text) {
        return { success: true };
      }

      const chatId = message.chat.id;
      const text = message.text.trim();

      if (text === '/start') {
        await this.quotesService.sendMessageToChat(
          chatId,
          '🌟 Welcome to the Daily Quotes Bot!\n\nYou will receive daily quotes and motivational messages.\n\nCommands:\n/start\n/help\n/contact',
        );
      } else if (text === '/help') {
        await this.quotesService.sendMessageToChat(
          chatId,
          'ℹ️ Commands:\n/start\n/help\n/contact\n\nDaily messages are sent automatically.',
        );
      } else if (text === '/contact') {
        await this.quotesService.sendMessageToChat(
          chatId,
          '📩 Contact: @mulersoft',
        );
      } else {
        await this.quotesService.sendMessageToChat(
          chatId,
          '❓ Unknown command. Type /help to see available commands.',
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook error:', error.message);
      return { success: false };
    }
  }
}
