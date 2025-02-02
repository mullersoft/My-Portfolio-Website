import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
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
import { TelegramModule } from './modules/telegram/telegram.module';
import { StudentModel } from './modules/student/student.schema';
import { StudentChatIdModel } from './modules/student/student-chat-id.schema';
import { ProjectModel } from './modules/projects/project.schema';

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
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  // OnModuleInit hook to ensure indexes are applied after the module is initialized
  async onModuleInit() {
    try {
      // Ensure indexes for StudentChatIdModel
      await StudentChatIdModel.ensureIndexes();
      // Ensure indexes for StudentModel
      await StudentModel.ensureIndexes();
      // Ensure indexes for ProjectModel
      await ProjectModel.ensureIndexes();

      console.log('Indexes have been successfully applied.');
    } catch (error) {
      console.error('Error applying indexes:', error);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackingMiddleware).forRoutes('*');
  }
}
