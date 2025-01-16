// D:\web D\portfolio-website\server\src\modules\student\student.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentBotService } from './student.bot.service';
import { StudentSchema } from './student.schema';
import { StudentBotController } from './student.bot.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
  ],
  controllers: [StudentController, StudentBotController],
  providers: [StudentService, StudentBotService],
})
export class StudentModule {}
