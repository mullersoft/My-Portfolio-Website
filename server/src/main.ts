import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Correct CORS configuration (with or without trailing slash)
  app.use(
    cors({
      origin: 'https://adorable-kelpie-19779b.netlify.app', // Make sure it matches exactly with the frontend URL (no trailing slash)
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  await app.listen(5000); // Ensure this is the correct port your backend is running on
}

bootstrap();
