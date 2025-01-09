import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'https://aesthetic-stroopwafel-42b2f3.netlify.app', // Deployed frontend
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE, PATCH',  // Ensure allowed methods
    allowedHeaders: 'Content-Type, Accept',  // Define allowed headers
    credentials: true,  // If you're using credentials like cookies
  });

  await app.listen(5000);
}

bootstrap();
