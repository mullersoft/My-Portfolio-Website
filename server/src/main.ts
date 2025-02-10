import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StudentBotService } from './modules/student/student.bot.service';
import { TelegramService } from './modules/telegram/telegram.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = ['https://aesthetic-stroopwafel-42b2f3.netlify.app'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  // Start the Telegram bot
  const studentBotService = app.get(StudentBotService);
  studentBotService.startBot();

  // Set the Telegram webhook
  const telegramService = app.get(TelegramService);
  await telegramService.setWebhook();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
