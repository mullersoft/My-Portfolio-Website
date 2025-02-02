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

  private async registerChatId(chatId: number) {
    try {
      await this.bot.telegram.sendMessage(chatId, 'Welcome!');
      const existingChat = await this.studentChatIdModel.findOne({ chatId });

      if (!existingChat) {
        await new this.studentChatIdModel({ chatId }).save();
        console.log(`Stored new chat ID: ${chatId}`);
      }
    } catch (error) {
      if (error.response?.error_code === 403) {
        console.log(`Bot was blocked by user with chat ID: ${chatId}.`);
      } else {
        console.error('Error storing chat ID:', error);
      }
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

    this.bot.start(async (ctx) => {
      console.log(`New student chat ID: ${ctx.chat.id}`);
      await this.registerChatId(ctx.chat.id);
      ctx.reply(
        `Welcome! Use /grade to check results or /contact to message the admin.`,
      );
    });

    this.bot.command('grade', async (ctx) => {
      await this.registerChatId(ctx.chat.id);
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
          const student = await this.studentService.getStudentGrade(studentId);
          if (!student) {
            ctx.reply('Student not found.');
          } else {
            ctx.reply(`
Student Name: ${student.Name}
Student ID: ${student.STUDENT_ID}
Assignment: ${student.ASSIGNMENT}
Project: ${student.PROJECT}
Midterm: ${student.MIDTERM}
Final Term: ${student.FINALTERM}
Total Grade: ${student.TOTAL}
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
  }

  async isUserActive(chatId: number): Promise<boolean> {
    try {
      const member = await this.bot.telegram.getChatMember(chatId, chatId);
      return member.status !== 'kicked' && member.status !== 'left';
    } catch (error) {
      console.error(`Error checking chat status for ${chatId}:`, error);
      return false;
    }
  }

  async sendNotification(message: string) {
    console.log('Sending notification:', message);
    try {
      const studentChatIds = await this.studentChatIdModel.find({});

      if (!studentChatIds || studentChatIds.length === 0) {
        console.log('No students found. Skipping notification.');
        return;
      }

      for (const student of studentChatIds) {
        try {
          if (await this.isUserActive(student.chatId)) {
            await this.bot.telegram.sendMessage(student.chatId, message);
            console.log(`Message sent to: ${student.chatId}`);
          } else {
            console.log(`User ${student.chatId} is inactive. Removing.`);
            await this.studentChatIdModel.deleteOne({ chatId: student.chatId });
          }
        } catch (error) {
          if (error.response?.error_code === 403) {
            console.log(`Blocked user ${student.chatId}. Removing.`);
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
      console.error('Error retrieving student chat IDs:', error);
    }
  }
}
