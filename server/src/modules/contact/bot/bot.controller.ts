import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  async handleTelegramWebhook(@Body() update: any): Promise<any> {
    if (update.message) {
      await this.botService.handleTelegramMessage(update.message);
    }
    return { success: true };
  }
}
