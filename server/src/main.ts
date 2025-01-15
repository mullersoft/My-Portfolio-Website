import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ContactService } from './modules/contact/contact.service'; // Import the ContactService
import * as dotenv from 'dotenv';
// some
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

  // const contactService = app.get(ContactService); // Get the ContactService instance
  // await contactService.setupTelegramMenu(); // Initialize the Telegram menu

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on this port: ${await app.getUrl()}`);
}

bootstrap();
