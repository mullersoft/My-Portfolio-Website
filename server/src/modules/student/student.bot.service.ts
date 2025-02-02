import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentService } from './student.service';
import { StudentChatId } from './student-chat-id.schema';

interface MySessionData {
  awaitingStudentId?: boolean;
  awaitingAdminMessage?: boolean;
}

interface MyContext extends Context {
  session: MySessionData;
}

@Injectable()
export class StudentBotService {
  constructor(
    private readonly studentService: StudentService,
    @InjectModel('StudentChatId')
    private readonly studentChatIdModel: Model<StudentChatId>,
  ) {}

  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN);
  private adminChatId = process.env.ASSESSMENT_BOT_CHAT_ID;

  getBotInstance(): Telegraf<MyContext> {
    return this.bot;
  }

  // Function to register chat ID if not already stored
  private async registerChatId(chatId: number) {
    const existingChat = await this.studentChatIdModel.findOne({
      chatId,
    });

    if (!existingChat) {
      await new this.studentChatIdModel({ chatId }).save();
      console.log(`Stored new chat ID: ${chatId}`);
    }
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

    // /start command handler
    this.bot.start(async (ctx) => {
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';
      ctx.reply(
        `Welcome, ${username}! Use /grade to check your results, /contact to message the admin, or /restart to reset your session.`,
      );

      console.log(`New student chat ID: ${ctx.chat.id}`);

      // Register chat ID if not already stored
      await this.registerChatId(ctx.chat.id);
    });

    // /grade command handler
    this.bot.command('grade', async (ctx) => {
      // Register chat ID if not already stored
      await this.registerChatId(ctx.chat.id);

      // Proceed with the grade request
      ctx.reply('Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    // /contact command handler
    this.bot.command('contact', (ctx) => {
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';
      ctx.reply(
        `Please type your message for the admin. Your username (${username}) will be included in the message sent to the admin.`,
      );
      ctx.session.awaitingAdminMessage = true;
    });

    // /restart command handler
    this.bot.command('restart', (ctx) => {
      ctx.session.awaitingStudentId = false;
      ctx.session.awaitingAdminMessage = false;
      ctx.reply('Your session has been reset.');
    });

    // Text message handler
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
    console.log('Sending notification to students:', message);

    try {
      // Fetch all stored chat IDs from MongoDB
      const studentChatIds = await this.studentChatIdModel.find({});
      console.log(
        'Stored student chat IDs:',
        studentChatIds.map((s) => s.chatId),
      );

      if (studentChatIds.length === 0) {
        console.log('No students found to send notification.');
        return;
      }

      for (const student of studentChatIds) {
        try {
          console.log(`Sending message to chat ID: ${student.chatId}`);
          await this.bot.telegram.sendMessage(student.chatId, message);
        } catch (error) {
          if (error.response?.error_code === 403) {
            console.log(
              `Bot was blocked by user with chat ID: ${student.chatId}. Skipping...`,
            );
            // Optionally, you can remove the blocked user from your database
            await this.studentChatIdModel.deleteOne({ chatId: student.chatId });
          } else {
            console.error(
              `Failed to send message to ${student.chatId}:`,
              error,
            );
          }
        }
      }
    } catch (error) {
      console.error('Error retrieving student chat IDs from MongoDB:', error);
    }
  }
}
