import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Correct CORS configuration 
  app.use(
    cors({
      origin: 'https://aesthetic-stroopwafel-42b2f3.netlify.app', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  await app.listen(5000); 
}

bootstrap();
