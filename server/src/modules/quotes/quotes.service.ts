import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class QuotesService implements OnModuleInit {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN; // Telegram bot token from .env
  private readonly chatId = process.env.QUOTE_BOT_CHAT_ID; // Telegram chat ID from .env
  private readonly telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  // private readonly botToken = process.env.BOT_TOKEN; // Bot token from environment variables
  // private readonly adminChatId = process.env.CONTACT_BOT_CHAT_ID; // Admin chat ID from environment variables

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

  // Send the quote to Telegram
  async sendQuoteToTelegram(): Promise<void> {
    try {
      const quote = await this.fetchQuote();
      await axios.post(this.telegramApiUrl, {
        chat_id: this.chatId,
        text: `📜 Daily Quote:\n\n${quote}`,
      });
      console.log('Quote sent to Telegram successfully.');
    } catch (error) {
      console.error('Error sending quote to Telegram:', error.message);
    }
  }

  // Schedule the daily quote task
  @Cron('0 9 * * *') // Runs every day at 9:00 AM
  async sendDailyQuote() {
    await this.sendQuoteToTelegram();
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
