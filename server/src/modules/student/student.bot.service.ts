import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import rateLimit from 'telegraf-ratelimit';
import { StudentService } from './student.service';

interface MySessionData {
  awaitingStudentId?: boolean;
  awaitingAdminMessage?: boolean;
}

interface MyContext extends Context {
  session: MySessionData;
}

@Injectable()
export class StudentBotService {
  constructor(private readonly studentService: StudentService) {}

  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN); // Ensure the token is set in the .env file
  private adminChatId = process.env.ADMIN_CHAT_ID; // Admin's Telegram Chat ID (set in .env)

  getBotInstance(): Telegraf<MyContext> {
    return this.bot;
  }

  startBot() {
    // Use session middleware
    this.bot.use(session({ defaultSession: () => ({}) }));

    // Add rate limiting middleware
    const limitConfig = {
      window: 1000, // 1 second
      limit: 3, // Maximum 3 messages per second
      onLimitExceeded: (ctx: MyContext) => {
        ctx.reply('Too many requests. Please slow down.');
      },
    };
    this.bot.use(rateLimit(limitConfig));

    // Start command to greet the user
    this.bot.start((ctx) => {
      ctx.reply(
        'Welcome! Use /grade to check your results or /contact to message the admin.',
      );
    });

    // Command to retrieve grades
    this.bot.command('grade', async (ctx) => {
      ctx.reply('Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    // Command to contact the admin
    this.bot.command('contact', (ctx) => {
      ctx.reply('Please type your message for the admin:');
      ctx.session.awaitingAdminMessage = true;
    });

    // Listen for any text input
    this.bot.on('text', async (ctx) => {
      if (ctx.session.awaitingStudentId) {
        const studentId = ctx.message.text.trim();

        try {
          const student = await this.studentService.getStudentGrade(studentId);

          if (!student) {
            ctx.reply('Student not found. Please check your ID and try again.');
          } else {
            const response = `
Student Name: ${student.Name}
Student ID: ${student.STUDENT_ID}
Assignment: ${student.ASSIGNMENT}
Test 1: ${student.TEST_1}
Test 2: ${student.TEST_2}
Project: ${student.PROJECT}
Midterm: ${student.MIDTERM}
Final Term: ${student.FINALTERM}
Total Grade: ${student.TOTAL}
            `;
            ctx.reply(response);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          ctx.reply(
            'An error occurred while fetching the data. Please try again later.',
          );
        } finally {
          ctx.session.awaitingStudentId = false;
        }
      } else if (ctx.session.awaitingAdminMessage) {
        const studentMessage = ctx.message.text.trim();

        // Forward the message to the admin
        if (this.adminChatId) {
          await this.bot.telegram.sendMessage(
            this.adminChatId,
            `Message from ${ctx.from.first_name || 'Student'} (${ctx.from.id}):\n\n${studentMessage}`,
          );
          ctx.reply('Your message has been sent to the admin. Thank you!');
        } else {
          ctx.reply(
            'Unable to send the message. Admin contact is not configured.',
          );
        }

        ctx.session.awaitingAdminMessage = false;
      } else {
        ctx.reply(
          'Please use /grade to check your results or /contact to message the admin.',
        );
      }
    });

    this.bot.launch();
  }
}
