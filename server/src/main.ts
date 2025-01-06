import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Correct CORS configuration
  app.enableCors(); // Enable CORS for all origins (or configure it as needed)

  await app.listen(5000);
}

bootstrap();
