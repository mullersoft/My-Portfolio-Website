import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabling CORS with specific origin (frontend URL)
  app.enableCors({
    origin: 'https://adorable-kelpie-19779b.netlify.app/', // Frontend URL here
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(5000);
}
bootstrap();
