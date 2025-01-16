import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentBotService } from './student.bot.service';

@Controller('webhook')
export class StudentBotController {
  constructor(private readonly studentBotService: StudentBotService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('Received webhook update:', req.body); // Log the incoming request
      const bot = this.studentBotService.getBotInstance();
      await bot.handleUpdate(req.body); // Forward the update to Telegraf
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Error');
    }
  }
}
