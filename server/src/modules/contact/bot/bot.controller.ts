// D:\web D\portfolio-website\server\src\modules\contact\bot\bot.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('contact/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('telegram-webhook')
  async handleTelegramWebhook(@Body() update: any): Promise<any> {
    if (update.message) {
      await this.botService.handleTelegramMessage(update);
    } else if (update.callback_query) {
      await this.botService.handleCallbackQuery(update.callback_query);
    }
    return { success: true };
  }
}
