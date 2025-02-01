import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import { StudentService } from './student.service';
import { StudentModel } from './student.schema'; // Import the model to access DB

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

  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN);
  private adminChatId = process.env.ASSESSMENT_BOT_CHAT_ID;

  // Fetch the chat IDs from the database on bot start
  private async fetchStudentChatIds() {
    const students = await StudentModel.find({ chatId: { $ne: null } });
    return students.map((student) => student.chatId);
  }

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
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';

      ctx.reply(
        `Welcome, ${username}! Use /grade to check your results, /contact to message the admin, or /restart to reset your session.`,
      );

      // Store the chatId in the database
      const existingStudent = await StudentModel.findOne({
        chatId: ctx.chat.id.toString(),
      });
      if (!existingStudent) {
        await StudentModel.updateOne(
          { STUDENT_ID: ctx.from.id.toString() }, // or use another unique identifier
          { $set: { chatId: ctx.chat.id.toString() } },
          { upsert: true },
        );
      }
    });

    this.bot.command('grade', (ctx) => {
      ctx.reply('Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    this.bot.command('contact', (ctx) => {
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';
      ctx.reply(
        `Please type your message for the admin. Your username (${username}) will be included in the message sent to the admin.`,
      );
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
        const username = ctx.from.username
          ? `@${ctx.from.username}`
          : ctx.from.first_name || 'User';

        if (this.adminChatId) {
          await this.bot.telegram.sendMessage(
            this.adminChatId,
            `Message from ${username} (${ctx.from.id}):\n\n${studentMessage}`,
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
          'Please use /grade to check your results, /contact to message the admin, or /restart to reset the session.',
        );
      }
    });
  }

  /**
   * Send a notification to all students who have interacted with the bot.
   * @param message - The message to send.
   */
  async sendNotification(message: string) {
    const studentChatIds = await this.fetchStudentChatIds();
    console.log('Sending notification to students:', message);
    console.log('Stored student chat IDs:', studentChatIds); // Debugging log
    for (const chatId of studentChatIds) {
      try {
        console.log(`Sending message to chat ID: ${chatId}`);
        await this.bot.telegram.sendMessage(chatId, message);
      } catch (error) {
        console.error(`Failed to send message to ${chatId}:`, error);
      }
    }
  }
}
