// D:\web D\portfolio-website\server\src\app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChatGptModule } from './modules/chatgpt/chatgpt.module';
import { IpTrackingMiddleware } from './middlewares/ip-tracking.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotesModule } from './modules/quotes/quotes.module';
import { BotModule } from './modules/contact/bot/bot.module';
import { FrontendModule } from './modules/contact/frontend/frontend.module';
import { StudentModule } from './modules/student/student.module';
// import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize ConfigModule to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    }),
    ProjectsModule,
    ChatGptModule,
    ScheduleModule.forRoot(),
    QuotesModule,
    BotModule,
    FrontendModule,
    StudentModule,
    // TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackingMiddleware).forRoutes('*');
  }
}
