import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class QuotesService implements OnModuleInit {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN; // Telegram bot token from .env
  private readonly chatId = process.env.QUOTE_BOT_CHAT_ID; // Telegram chat ID from .env
  private readonly telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  private readonly webhookUrl = process.env.QUOT_WEBHOOK_URL; // Webhook URL from .env

  // Fetch a random quote from the Quotable API
  async fetchQuote(): Promise<string> {
    try {
      const response = await axios.get('http://api.quotable.io/random');
      const { content, author } = response.data;
      return `"${content}"\n- ${author}`;
    } catch (error) {
      console.error('Error fetching quote:', error.message);
      return 'Could not fetch a quote at this time. Please try again later.';
    }
  }

  // Fetch a motivational speech from the ZenQuotes API
  async fetchMotivationalSpeech(): Promise<string> {
    try {
      const response = await axios.get('https://zenquotes.io/api/random'); // ZenQuotes API
      const { q: quote, a: author } = response.data[0];
      return `"${quote}"\n- ${author}`;
    } catch (error) {
      console.error('Error fetching motivational speech:', error.message);
      return 'Could not fetch a motivational speech at this time. Please try again later.';
    }
  }

  // Send a message to Telegram
  async sendMessageToTelegram(text: string): Promise<void> {
    try {
      await axios.post(this.telegramApiUrl, {
        chat_id: this.chatId,
        text,
      });
      console.log('Message sent to Telegram successfully.');
    } catch (error) {
      console.error('Error sending message to Telegram:', error.message);
    }
  }

  // Send the daily quote to Telegram
  @Cron('0 9 * * *') // Runs every day at 9:00 AM
  async sendDailyQuote(): Promise<void> {
    try {
      console.log('Triggering daily quote cron job...');
      const quote = await this.fetchQuote();
      await this.sendMessageToTelegram(`📜 Daily Quote:\n\n${quote}`);
      console.log('Daily quote sent successfully.');
    } catch (error) {
      console.error('Error sending daily quote:', error.message);
    }
  }

  // Send the daily motivational speech to Telegram
  @Cron('0 10 * * *') // Runs every day at 10:00 AM
  async sendDailyMotivationalSpeech(): Promise<void> {
    try {
      console.log('Triggering daily motivational speech cron job...');
      const motivationalSpeech = await this.fetchMotivationalSpeech();
      await this.sendMessageToTelegram(
        `💪 Daily Motivational Speech:\n\n${motivationalSpeech}`,
      );
      console.log('Daily motivational speech sent successfully.');
    } catch (error) {
      console.error('Error sending daily motivational speech:', error.message);
    }
  }

  // Set the webhook for Telegram bot
  private async setWebhook(): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/setWebhook?url=${this.webhookUrl}`;
    try {
      await axios.get(url);
      console.log('Webhook set successfully!');
    } catch (error) {
      console.error('Error setting webhook:', error.message);
    }
  }

  // Initialize the webhook on module initialization
  async onModuleInit(): Promise<void> {
    await this.setWebhook();
  }
}
