import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class QuotesService implements OnModuleInit {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN; // Telegram bot token from .env
  private readonly chatId = process.env.QUOTE_BOT_CHAT_ID; // Telegram chat ID from .env
  private readonly telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

  // private readonly webhookUrl = `https://yourdomain.com/quotes/bot/telegram-webhook`; // Replace with your actual URL
  private readonly webhookUrl = process.env.QUOT_WEBHOOK_URL;
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

  // Fetch a motivational speech from an external API (e.g., Inspire API)
  async fetchMotivationalSpeech(): Promise<string> {
    try {
      const response = await axios.get(
        'https://inspire-api.herokuapp.com/api/quote',
      );
      const { quote, author } = response.data; // Assuming the API returns a quote and author
      return `"${quote}"\n- ${author}`;
    } catch (error) {
      console.error('Error fetching motivational speech:', error.message);
      return 'Could not fetch a motivational speech at this time. Please try again later.';
    }
  }

  // Send the quote and motivational speech to Telegram
  async sendDailyMessageToTelegram(): Promise<void> {
    try {
      const quote = await this.fetchQuote();
      const motivationalSpeech = await this.fetchMotivationalSpeech();

      // Send quote
      await axios.post(this.telegramApiUrl, {
        chat_id: this.chatId,
        text: `📜 Daily Quote:\n\n${quote}`,
      });

      // Send motivational speech
      await axios.post(this.telegramApiUrl, {
        chat_id: this.chatId,
        text: `💪 Daily Motivational Speech:\n\n${motivationalSpeech}`,
      });

      console.log(
        'Quote and Motivational Speech sent to Telegram successfully.',
      );
    } catch (error) {
      console.error(
        'Error sending quote and motivational speech to Telegram:',
        error.message,
      );
    }
  }

  // Schedule the daily quote task at 9:00 AM
  @Cron('0 9 * * *') // Runs every day at 9:00 AM
  async sendDailyQuote() {
    const quote = await this.fetchQuote();
    await axios.post(this.telegramApiUrl, {
      chat_id: this.chatId,
      text: `📜 Daily Quote:\n\n${quote}`,
    });
    console.log('Quote sent to Telegram successfully at 9:00 AM.');
  }

  // Schedule the daily motivational speech task at 10:00 AM
  @Cron('0 10 * * *') // Runs every day at 10:00 AM
  async sendDailyMotivationalSpeech() {
    const motivationalSpeech = await this.fetchMotivationalSpeech();
    await axios.post(this.telegramApiUrl, {
      chat_id: this.chatId,
      text: `💪 Daily Motivational Speech:\n\n${motivationalSpeech}`,
    });
    console.log(
      'Motivational speech sent to Telegram successfully at 10:00 AM.',
    );
  }

  // Send a message to Telegram
  async sendMessageToTelegram(chatId: number, text: string): Promise<void> {
    try {
      await axios.post(this.telegramApiUrl, {
        chat_id: chatId,
        text,
      });
      console.log('Message sent to Telegram successfully.');
    } catch (error) {
      console.error('Error sending message to Telegram:', error.message);
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

  // Call setWebhook on module initialization
  async onModuleInit() {
    await this.setWebhook();
  }
}
