import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Explicit CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local development
      'https://aesthetic-stroopwafel-42b2f3.netlify.app', // Deployed frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies if needed
  });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
