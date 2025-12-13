import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { StudentBotService } from './modules/student/student.bot.service';
// import { TelegramService } from './modules/telegram/telegram.service';

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

  // Custom message for root URL "/"
  app.use((req: Request, res: Response, next) => {
    if (req.path === '/') {
      return res.send(`
        <h2>Welcome to my personal website of backend API Developed by Mulugeta Linger!</h2>
        <p>Please visit our frontend application at
          <a href="https://aesthetic-stroopwafel-42b2f3.netlify.app/" target="_blank">Frontend Application</a>
          to use the full application.</p>
        <p>You can customize this code for your own use.</p>
        <p>If you are very kind, please help me find a great job. I don't ask for money, just an opportunity. Thank you, see you again!</p>
      `);
    }
    next();
  });

  // Start the Telegram bot
  const studentBotService = app.get(StudentBotService);
  studentBotService.startBot();

  // Set the Telegram webhook
  // const telegramService = app.get(TelegramService);
  // await telegramService.setWebhook();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
