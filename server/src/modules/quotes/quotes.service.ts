import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class QuotesService {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN; // Telegram bot token from .env
  private readonly chatId = process.env.TELEGRAM_CHAT_ID; // Telegram chat ID from .env
  private readonly telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

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
  @Cron('*/2 * * * *') // Runs every day at 9:00 AM
  async sendDailyQuote() {
    await this.sendQuoteToTelegram();
  }
}
