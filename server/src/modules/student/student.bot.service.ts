import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import { StudentService } from './student.service';
import mongoose from 'mongoose';
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
  constructor(private readonly studentService: StudentService) {}

  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN);
  private adminChatId = process.env.ASSESSMENT_BOT_CHAT_ID;

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

      console.log(`New student chat ID: ${ctx.chat.id}`);
      await this.saveStudentChatId(ctx.chat.id); // Store student chat ID in MongoDB
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
          try {
            await this.bot.telegram.sendMessage(
              this.adminChatId,
              `Message from ${username} (${ctx.from.id}):\n\n${studentMessage}`,
            );
            ctx.reply('Your message has been sent to the admin. Thank you!');
          } catch (error) {
            console.error('Error sending message to admin:', error);
            ctx.reply(
              'Failed to send the message to the admin. Please try again later.',
            );
          }
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

  private async saveStudentChatId(chatId: number) {
    try {
      // Check if the chat ID already exists in the database
      const existingChatId = await StudentChatId.findOne({ chatId });
      if (!existingChatId) {
        // Save new chat ID to the database
        await StudentChatId.create({ chatId });
        console.log(`Stored new chat ID: ${chatId}`);
      }
    } catch (error) {
      console.error('Error saving chat ID:', error);
    }
  }

  /**
   * Send a notification to all students who have interacted with the bot.
   * @param message - The message to send.
   */
  // async sendNotification(message: string) {
  //   console.log('Sending notification to students:', message);

  //   try {
  //     const students = await StudentChatId.find();
  //     for (const student of students) {
  //       try {
  //         console.log(`Sending message to chat ID: ${student.chatId}`);
  //         await this.bot.telegram.sendMessage(student.chatId, message);
  //       } catch (error) {
  //         // Handle the error gracefully when the bot is blocked by the user (403 error)
  //         if (error.response && error.response.error_code === 403) {
  //           console.log(
  //             `Bot was blocked by user with chat ID: ${student.chatId}`,
  //           );
  //           // Optionally, you could also remove the blocked user from the database
  //           // await StudentChatId.deleteOne({ chatId: student.chatId });
  //         } else {
  //           console.error(
  //             `Failed to send message to ${student.chatId}:`,
  //             error,
  //           );
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching students from database:', error);
  //   }
  // }
  sendNotification = async (message: string) => {
    try {
      // Fetch students from the database
      const students = await StudentChatId.find();

      // Send notification to each student
      for (const student of students) {
        try {
          await this.bot.telegram.sendMessage(student.chatId, message);
        } catch (err) {
          if (err.error_code === 403) {
            console.log(`Bot blocked by user: ${student.chatId}`);
            // Optionally, update the database to mark this user as blocked.
          } else {
            console.error(`Error sending message to ${student.chatId}:`, err);
          }
        }
      }
    } catch (err) {
      if (err instanceof mongoose.Error) {
        console.error('Database operation failed:', err.message);
        // Implement retry logic for MongoDB here if needed
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  // Example call
  // this.sendNotification('Your message here!');
}
