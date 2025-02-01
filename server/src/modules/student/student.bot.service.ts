import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import { StudentModel } from './student.schema';

interface MySessionData {
  awaitingStudentId?: boolean;
  awaitingAdminMessage?: boolean;
}

interface MyContext extends Context {
  session: MySessionData;
}

@Injectable()
export class StudentBotService {
  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN);
  private adminChatId = process.env.ASSESSMENT_BOT_CHAT_ID;

  constructor() {}

  getBotInstance(): Telegraf<MyContext> {
    return this.bot;
  }

  async startBot() {
    this.bot.use(session({ defaultSession: () => ({}) }));

    console.log('Bot is starting...');

    const webhookUrl = process.env.ASSESSMENT_WEBHOOK_URL;
    if (webhookUrl) {
      await this.bot.telegram.setWebhook(webhookUrl);
      console.log('Webhook is set to:', webhookUrl);
    } else {
      console.error('Webhook URL is not defined.');
      return;
    }

    this.bot.start(async (ctx) => {
      const chatId = ctx.chat.id;
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';

      ctx.reply(
        `Welcome, ${username}! Use /grade to check your results, /contact to message the admin, or /restart to reset your session.`,
      );

      try {
        const existingStudent = await StudentModel.findOne({ chatId });
        if (!existingStudent) {
          await StudentModel.findOneAndUpdate(
            { STUDENT_ID: ctx.from.id },
            { chatId: chatId },
            { upsert: true, new: true },
          );
          console.log(`New student chat ID saved: ${chatId}`);
        } else {
          console.log(`Student chat ID already exists: ${chatId}`);
        }
      } catch (error) {
        console.error('Error saving student chat ID:', error);
      }
    });

    this.bot.command('grade', (ctx) => {
      ctx.reply('Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    this.bot.command('contact', (ctx) => {
      ctx.reply('Please type your message for the admin.');
      ctx.session.awaitingAdminMessage = true;
    });

    this.bot.command('restart', (ctx) => {
      ctx.session.awaitingStudentId = false;
      ctx.session.awaitingAdminMessage = false;
      ctx.reply('Your session has been reset.');
    });

    this.bot.on('text', async (ctx) => {
      if (ctx.session.awaitingStudentId) {
        const studentId = ctx.message.text.trim();
        try {
          const student = await StudentModel.findOne({ STUDENT_ID: studentId });

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
        if (this.adminChatId) {
          await this.bot.telegram.sendMessage(
            this.adminChatId,
            `Message from student: ${studentMessage}`,
          );
          ctx.reply('Your message has been sent to the admin.');
        } else {
          ctx.reply('Admin contact is not configured.');
        }
        ctx.session.awaitingAdminMessage = false;
      } else {
        ctx.reply(
          'Use /grade to check results, /contact to message the admin.',
        );
      }
    });
  }

  /**
   * Send a notification to all students stored in the database.
   * @param message - The message to send.
   */
  async sendNotification(message: string) {
    console.log('Sending notification to students:', message);
    try {
      const students = await StudentModel.find({
        chatId: { $exists: true },
      }).select('chatId');
      if (students.length === 0) {
        console.log('No students found with chat IDs.');
        return;
      }

      for (const student of students) {
        try {
          console.log(`Sending message to chat ID: ${student.chatId}`);
          await this.bot.telegram.sendMessage(student.chatId, message);
        } catch (error) {
          console.error(`Failed to send message to ${student.chatId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching student chat IDs:', error);
    }
  }
}
