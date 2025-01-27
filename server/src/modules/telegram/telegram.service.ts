import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class TelegramService {
  private readonly botToken: string = process.env.AUTORESPONSE_BOT_TOKEN;
  private isActive: boolean = true; // Indicates your availability status

  constructor() {
    if (!this.botToken) {
      console.error(
        'AUTORESPONSE_BOT_TOKEN is not defined in environment variables.',
      );
    }
  }

  // Toggle your availability status
  toggleAvailability(): void {
    this.isActive = !this.isActive;
    console.log(
      `Availability status: ${this.isActive ? 'Active' : 'Inactive'}`,
    );
  }

  // Send a message to a specific user
  async sendMessageToUser(chatId: number, message: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error('Error sending message to user:', data.description);
      }
    } catch (error) {
      console.error('Error sending message to Telegram user:', error);
    }
  }

  // Get your availability status
  getAvailability(): boolean {
    return this.isActive;
  }

  // Set the webhook for Telegram
  async setWebhook(): Promise<void> {
    const webhookUrl = process.env.WEBHOOK_URL; // Ensure this is set in your environment variables
    if (!webhookUrl) {
      console.error('WEBHOOK_URL is not defined in environment variables.');
      return;
    }

    const url = `https://api.telegram.org/bot${this.botToken}/telegramwebhook`;
    const payload = { url: webhookUrl };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.ok) {
        console.log('Webhook set successfully:', webhookUrl);
      } else {
        console.error('Error setting webhook:', data.description);
      }
    } catch (error) {
      console.error('Error setting Telegram webhook:', error);
    }
  }
}
