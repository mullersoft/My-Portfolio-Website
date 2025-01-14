import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { StudentService } from './student.service';

@Injectable()
export class StudentBotService {
  constructor(private readonly studentService: StudentService) {}

  private bot = new Telegraf(process.env.BOT_TOKEN);

  startBot() {
    // Start command to greet the user
    this.bot.start((ctx) =>
      ctx.reply('Welcome! Use /grade to check your results.'),
    );

    // Command to retrieve grades
    this.bot.command('grade', async (ctx) => {
      ctx.reply('Please enter your Student ID:');
      this.bot.on('text', async (msgCtx) => {
        const studentId = msgCtx.message.text;
        try {
          // Fetch grade details using the StudentService
          const student = await this.studentService.getStudentGrade(studentId);
          const response = `
Student Name: ${student.studentName}
Student ID: ${student.studentId}
Quiz: ${student.quiz}
Test: ${student.test}
Assignment: ${student.assignment}
Project: ${student.project}
Mid Exam: ${student.midExam}
Final Exam: ${student.finalExam}
Total Grade: ${student.totalGrade}
          `;
          msgCtx.reply(response);
        } catch (error) {
          msgCtx.reply(
            'Student not found. Please check your ID and try again.',
          );
        }
      });
    });

    // Launch the bot
    this.bot.launch();
  }
}
