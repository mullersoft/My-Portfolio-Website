import { Injectable } from '@nestjs/common';
import { Telegraf, Context, session } from 'telegraf';
import { StudentService } from './student.service';

interface MySessionData {
  awaitingStudentId?: boolean;
}

interface MyContext extends Context {
  session: MySessionData;
}

@Injectable()
export class StudentBotService {
  constructor(private readonly studentService: StudentService) {}

  private bot = new Telegraf<MyContext>(process.env.ASSESSMENT_BOT_TOKEN); // Ensure the token is set in the .env file

  getBotInstance(): Telegraf<MyContext> {
    return this.bot;
  }

  startBot() {
    // Use session middleware
    this.bot.use(session({ defaultSession: () => ({}) }));

    // Start command to greet the user
    this.bot.start((ctx) => {
      console.log('Start command received'); // Log the /start command
      ctx.reply('Welcome! Use /grade to check your results.');
    });

    // Command to retrieve grades
    this.bot.command('grade', async (ctx) => {
      console.log('Grade command received'); // Log the /grade command
      ctx.reply('Please enter your Student ID:');
      ctx.session.awaitingStudentId = true;
    });

    // Listen for any text input only when the bot is awaiting student ID
    this.bot.on('text', async (ctx) => {
      console.log('Text received:', ctx.message.text); // Log the text received
      if (ctx.session.awaitingStudentId) {
        const studentId = ctx.message.text.trim(); // Trim whitespace
        console.log('Student ID received:', studentId); // Log the student ID

        try {
          const student = await this.studentService.getStudentGrade(studentId);

          if (!student) {
            // Handle case when no student is found
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
          // Reset the session flag
          ctx.session.awaitingStudentId = false;
        }
      } else {
        // Handle unexpected text input
        ctx.reply('Please use /grade to check your results.');
      }
    });

    this.bot.launch();
  }
}
