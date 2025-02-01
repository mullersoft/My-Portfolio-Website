import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentBotService } from './student.bot.service';

@Controller('webhook')
export class StudentBotController {
  constructor(private readonly studentBotService: StudentBotService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const bot = this.studentBotService.getBotInstance();
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Error');
    }
  }

  @Post('notify')
  async sendNotification(
    @Body() body: { message: string },
    @Res() res: Response,
  ) {
    console.log('Received notification request:', body);
    try {
      await this.studentBotService.sendNotification(body.message);
      res.status(200).send('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification.');
    }
  }
}
