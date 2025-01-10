import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000', // Local development
    'https://aesthetic-stroopwafel-42b2f3.netlify.app', // Deployed frontend
  ];

  app.enableCors({
    origin: (origin, callback) => {
      console.log('Origin:', origin); // Log incoming request origins
      if (
        !origin ||
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        callback(null, true);
      } else {
        console.error('Blocked by CORS:', origin); // Log blocked origins
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  const PORT = process.env.PORT || 5000; // Use environment variable for the port
  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
