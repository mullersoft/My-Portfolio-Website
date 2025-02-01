// D:\web D\portfolio-website\server\src\modules\student\student.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentBotService } from './student.bot.service';
import { StudentSchema } from './student.schema';
import { StudentBotController } from './student.bot.controller';
import { StudentChatId } from './student-chat-id.schema';

@Module({
  imports: [
    // Importing the StudentSchema to interact with MongoDB
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: StudentChatId.name, schema: StudentChatId.schema },
    ]),
  ],
  controllers: [StudentController, StudentBotController], // Controllers to handle API requests and webhook updates
  providers: [StudentService, StudentBotService], // Services to handle logic for students and the bot
})
export class StudentModule {}
