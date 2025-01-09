import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    // 'http://localhost:3000/', // Local development
    'https://aesthetic-stroopwafel-42b2f3.netlify.app/', // Deployed frontend
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow the origin or when no origin is present (e.g., in a curl request)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Define allowed methods if needed
    allowedHeaders: 'Content-Type, Accept', // Set allowed headers
  });

  await app.listen(5000);
}

bootstrap();
