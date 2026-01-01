import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class QuotesService {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

  private readonly chatIds: number[] =
    process.env.QUOTE_BOT_CHAT_IDS?.split(',').map((id) => Number(id.trim())) ||
    [];

  // Fetch random quote
  async fetchQuote(): Promise<string> {
    try {
      const response = await axios.get('https://api.quotable.io/random', {
        timeout: 5000,
      });

      const { content, author } = response.data;
      return `"${content}"\n- ${author}`;
    } catch (error) {
      console.error('Error fetching quote:', error.message);
      return 'Could not fetch a quote at this time.';
    }
  }

  // Fetch motivational speech
  async fetchMotivationalSpeech(): Promise<string> {
    try {
      const response = await axios.get('https://zenquotes.io/api/random', {
        timeout: 5000,
      });

      const { q, a } = response.data[0];
      return `"${q}"\n- ${a}`;
    } catch (error) {
      console.error('Error fetching motivational speech:', error.message);
      return 'Could not fetch a motivational speech at this time.';
    }
  }

  // Send message to ALL chats (used by Cron jobs)
  private async sendToAllChats(text: string): Promise<void> {
    if (!this.chatIds.length) {
      console.warn('No chat IDs configured');
      return;
    }

    for (const chatId of this.chatIds) {
      try {
        await axios.post(this.telegramApiUrl, {
          chat_id: chatId,
          text,
        });
      } catch (error) {
        console.error(
          `Failed to send message to chat ${chatId}:`,
          error.message,
        );
      }
    }
  }

  // Send message to ONE chat (used by webhook/controller)
  async sendMessageToChat(chatId: number, text: string): Promise<void> {
    try {
      await axios.post(this.telegramApiUrl, {
        chat_id: chatId,
        text,
      });
    } catch (error) {
      console.error(`Failed to send message to chat ${chatId}:`, error.message);
    }
  }

  // Daily quote at 9:00 AM
  @Cron('0 9 * * *')
  async sendDailyQuote() {
    console.log('Sending daily quote...');
    const quote = await this.fetchQuote();
    await this.sendToAllChats(`📜 Daily Quote:\n\n${quote}`);
  }

  // Daily motivational speech at 10:00 AM
  @Cron('0 10 * * *')
  async sendDailyMotivationalSpeech() {
    console.log('Sending daily motivational speech...');
    const speech = await this.fetchMotivationalSpeech();
    await this.sendToAllChats(`💪 Daily Motivational Speech:\n\n${speech}`);
  }
}
