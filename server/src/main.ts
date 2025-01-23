//D:\web D\portfolio-website\server\src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StudentBotService } from './modules/student/student.bot.service';
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
  // Call the startBot method to initialize the Telegram bot
  const studentBotService = app.get(StudentBotService);
  studentBotService.startBot();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on this port: ${await app.getUrl()}`);
}
bootstrap();
