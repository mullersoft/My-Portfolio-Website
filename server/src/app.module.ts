// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactModule } from './modules/contact/contact.module';
import { ChatGptModule } from './modules/chatgpt/chatgpt.module';
import { IpTrackingMiddleware } from './middlewares/ip-tracking.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotesModule } from './modules/quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize ConfigModule to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI), // Use MONGO_URI from .env
    UsersModule,
    ProjectsModule,
    ContactModule,
    ChatGptModule,
    ScheduleModule.forRoot(), // Enable scheduling
    QuotesModule, // Import the quotes module
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackingMiddleware).forRoutes('*'); // Apply to all routes
  }
}
