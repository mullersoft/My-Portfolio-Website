import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StudentBotService } from './student.bot.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('webhook')
export class StudentBotController {
  constructor(private readonly studentBotService: StudentBotService) {}

  @Post('notify')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async sendNotification(
    @Body() body: { message?: string },
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const pdfPath = file ? file.filename : undefined;
      await this.studentBotService.sendNotification({
        message: body.message,
        pdfPath,
      });
      res.status(200).send('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification.');
    }
  }
}
