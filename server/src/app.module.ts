// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChatGptModule } from './modules/chatgpt/chatgpt.module';
import { IpTrackingMiddleware } from './middlewares/ip-tracking.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotesModule } from './modules/quotes/quotes.module';
import { BotModule } from './modules/contact/bot/bot.module';
import { FrontendModule } from './modules/contact/frontend/frontend.module';
import { StudentModule } from './modules/student/student.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize ConfigModule to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI), // Use MONGO_URI from .env
    ProjectsModule,
    ChatGptModule,
    ScheduleModule.forRoot(), // Enable scheduling
    QuotesModule,
    BotModule,
    FrontendModule,
    StudentModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackingMiddleware).forRoutes('*'); // Apply to all routes
  }
}
