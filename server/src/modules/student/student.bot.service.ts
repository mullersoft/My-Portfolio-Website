import { Injectable } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { session } from 'telegraf-session'; // Corrected session import
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentService } from './student.service';
import { StudentChatId } from './student-chat-id.schema';

interface MySessionData {
  awaitingStudentId?: boolean;
  awaitingAdminMessage?: boolean;
}

interface MyContext extends Context {
  session?: MySessionData;
}

@Injectable()
export class StudentBotService {
  private bot: Telegraf<MyContext>;
  private adminChatId: string;

  constructor(
    private readonly studentService: StudentService,
    @InjectModel('StudentChatId') private readonly studentChatIdModel: Model<StudentChatId>,
  ) {
    this.bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN);
    this.adminChatId = process.env.ASSESSMENT_BOT_CHAT_ID;

    this.bot.use(session()); // Applying session middleware
  }

  async startBot() {
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
      await this.registerChatId(ctx.chat.id);
      ctx.session = {}; // Initialize session
      ctx.reply('Welcome! Use /grade to check results or /contact to message the admin.');
    });

    this.bot.command('grade', async (ctx) => {
      await this.registerChatId(ctx.chat.id);
      ctx.session ||= {}; // Ensure session is initialized
      ctx.session.awaitingStudentId = true;
      ctx.reply('Please enter your Student ID:');
    });

    this.bot.command('contact', (ctx) => {
      ctx.session ||= {};
      ctx.session.awaitingAdminMessage = true;
      ctx.reply('Please type your message for the admin.');
    });

    this.bot.command('restart', (ctx) => {
      ctx.session = {};
      ctx.reply('Your session has been reset.');
    });

    this.bot.on('text', async (ctx) => {
      ctx.session ||= {};

      if (ctx.session.awaitingStudentId) {
        const studentId = ctx.message.text.trim();
        try {
          const student = await this.studentService.getStudentGrade(studentId);
          if (!student) {
            ctx.reply('Student not found.');
          } else {
            ctx.reply(`
Full Name: ${student.Name}
Assignment: ${student.ASSIGNMENT}
Project: ${student.PROJECT}
Midterm: ${student.MIDTERM}
Final Term: ${student.FINALTERM}
            `);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          ctx.reply('An error occurred. Please try again later.');
        } finally {
          ctx.session.awaitingStudentId = false;
        }
      } else if (ctx.session.awaitingAdminMessage) {
        const studentMessage = ctx.message.text.trim();
        try {
          if (this.adminChatId) {
            await this.bot.telegram.sendMessage(
              this.adminChatId,
              `Message from ${ctx.from.username || 'User'}: ${studentMessage}`,
            );
            ctx.reply('Your message has been sent.');
          } else {
            ctx.reply('Admin contact is not configured.');
          }
        } catch (error) {
          console.error('Error sending message:', error);
          ctx.reply('Failed to send message.');
        }
        ctx.session.awaitingAdminMessage = false;
      } else {
        ctx.reply('Use /grade or /contact.');
      }
    });

    this.bot.launch();
  }

  async sendNotification(data: any): Promise<void> {
    // Implement notification logic here
    console.log("Sending notification:", data);
  }

  async registerChatId(chatId: number): Promise<void> {
    // Logic to register chat ID (save it to a database or memory)
    console.log('Registering chat ID:', chatId);
    // Example: save chatId in the database
    await this.studentChatIdModel.create({ chatId });
  }
}
