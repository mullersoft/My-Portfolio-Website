import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // Correct CORS configuration
  app.enableCors(); // Enable CORS for all origins (or configure it as needed)

  await app.listen(5000);
=======
  // Correct CORS configuration 
  app.use(
    cors({
      origin: 'https://aesthetic-stroopwafel-42b2f3.netlify.app', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  await app.listen(5000); 
>>>>>>> e4beee722a278be04d49ac363a17de685f329d79
}

bootstrap();
