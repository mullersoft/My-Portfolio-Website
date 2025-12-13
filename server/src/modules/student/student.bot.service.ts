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
      await this.bot.telegram.sendMessage(chatId, '✅ ወደ ተማሪ ቦት እንኳን ደህና መጡ!');
      const existingChat = await this.studentChatIdModel.findOne({ chatId });

      if (!existingChat) {
        await new this.studentChatIdModel({ chatId }).save();
        console.log(`✅ Stored new chat ID: ${chatId}`);
      }
    } catch (error) {
      if (error.response?.error_code === 403) {
        console.log(`🚫 User ${chatId} blocked the bot. Skipping storage.`);
      } else {
        console.error('❌ Error storing chat ID:', error);
      }
    }
  }

  async startBot() {
    this.bot.use(session({ defaultSession: () => ({}) }));

    console.log('🚀 Bot is starting...');

    const webhookUrl = process.env.ASSESSMENT_WEBHOOK_URL;
    if (webhookUrl) {
      await this.bot.telegram.setWebhook(webhookUrl);
      console.log('✅ Webhook is set to:', webhookUrl);
    } else {
      console.error('❌ Webhook URL is not defined.');
      return;
    }

    this.bot.start(async (ctx) => {
      console.log(`👤 New student chat ID: ${ctx.chat.id}`);
      await this.registerChatId(ctx.chat.id);
      ctx.reply(
        `✅ Welcome! Use /grade to check results, /contact to message the admin, or /restart to reset your session.`,
      );
    });

    this.bot.command('grade', async (ctx) => {
      // await this.registerChatId(ctx.chat.id);
      ctx.reply('📚 Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    this.bot.command('contact', (ctx) => {
      const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name || 'User';
      ctx.reply(
        `✉️ Please type your message for the admin: `,
      );
      ctx.session.awaitingAdminMessage = true;
    });

    this.bot.command('restart', (ctx) => {
      ctx.session.awaitingStudentId = false;
      ctx.session.awaitingAdminMessage = false;
      ctx.reply(
        '🔄 Your session has been reseted.Use /grade to check results, /contact to message the admin',
      );
    });

    this.bot.on('text', async (ctx) => {
      if (ctx.session.awaitingStudentId) {
        const studentId = ctx.message.text.trim();
        try {
          const student = await this.studentService.getStudentGrade(studentId);
          if (!student) {
            ctx.reply(
              '❌ Student not found. Please check your ID and try again.',
            );
          } else {
            const response = `
🎓 Student Name: ${student.Name}
🆔 Student ID: ${student.STUDENT_ID}
📑 Assignment: ${student.ASSIGNMENT}
📝 Test 1: ${student.TEST_1}
📝 Test 2: ${student.TEST_2}
📌 Project: ${student.PROJECT}
📖 Midterm: ${student.MIDTERM}
📚 Final Term: ${student.FINALTERM}
🏆 Total Grade: ${student.TOTAL}
            `;
            ctx.reply(response);
          }
        } catch (error) {
          console.error('❌ Error fetching student data:', error);
          ctx.reply('⚠️ An error occurred. Please try again later.');
        } finally {
          ctx.session.awaitingStudentId = false;
        }
      } else if (ctx.session.awaitingAdminMessage) {
        const studentMessage = ctx.message.text.trim();
        const username = ctx.from.username
          ? `@${ctx.from.username}`
          : ctx.from.first_name || 'User';

        if (this.adminChatId) {
          try {
            await this.bot.telegram.sendMessage(
              this.adminChatId,
              `📩 Message from ${username} (${ctx.from.id}):\n\n${studentMessage}`,
            );
            ctx.reply('✅ Your message has been sent to the admin.');
          } catch (error) {
            console.error('❌ Error sending message to admin:', error);
            ctx.reply('⚠️ Failed to send the message.');
          }
        } else {
          ctx.reply('❌ Admin contact is not configured.');
        }

        ctx.session.awaitingAdminMessage = false;
      } else {
        ctx.reply('⚠️ Use /grade, /contact, or /restart.');
      }
    });
  }

  async sendNotification(message: string) {
    console.log('📢 Sending notification:', message);
    try {
      const studentChatIds = await this.studentChatIdModel.find({});
      if (studentChatIds.length === 0) {
        console.log('⚠️ No students found.');
        return;
      }

      for (const student of studentChatIds) {
        try {
          await this.bot.telegram.sendMessage(student.chatId, message);
          console.log(`✅ Message sent to: ${student.chatId}`);
        } catch (error) {
          if (error.response?.error_code === 403) {
            console.log(
              `🚫 User ${student.chatId} blocked the bot. Removing from database.`,
            );
            await this.studentChatIdModel.deleteOne({ chatId: student.chatId });
          } else {
            console.error(
              `❌ Failed to send message to ${student.chatId}:`,
              error,
            );
          }
        }
      }
    } catch (error) {
      console.error('❌ Error retrieving student chat IDs:', error);
    }
  }
}
