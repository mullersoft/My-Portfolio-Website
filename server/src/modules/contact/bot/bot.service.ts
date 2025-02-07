import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  private readonly botToken = process.env.BOT_TOKEN;
  private readonly adminChatId = process.env.CONTACT_BOT_CHAT_ID;

  private userStates = new Map<
    string,
    { step: string; data: Partial<Contact> }
  >();

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}`;
  }

  async onModuleInit() {
    await this.setWebhook();
  }

  private async setWebhook(): Promise<void> {
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    const url = `${this.getTelegramApiUrl()}/setWebhook?url=${webhookUrl}`;

    try {
      const response = await axios.get(url);
      console.log('Webhook set successfully!', response.data);
    } catch (error) {
      console.error(
        'Error setting webhook:',
        error?.response?.data || error.message,
      );
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    try {
      const chatId = update?.message?.chat?.id;
      const text = update?.message?.text;

      if (!chatId || !text) return;

      switch (text) {
        case '/start':
          this.userStates.delete(chatId);
          await this.sendTelegramMessage(
            chatId,
            'Welcome! Use /contact to send us a message.',
          );
          return;

        case '/help':
          this.userStates.delete(chatId);
          await this.sendTelegramMessage(
            chatId,
            'Use /contact to send a message.',
          );
          return;

        case '/contact':
          this.userStates.set(chatId, { step: 'ask_name', data: {} });
          await this.sendTelegramMessage(chatId, 'What is your name?');
          return;

        default:
          break;
      }

      const userState = this.userStates.get(chatId);
      if (!userState) {
        await this.sendTelegramMessage(
          chatId,
          'Invalid command. Use /contact.',
        );
        return;
      }

      const { step, data } = userState;

      if (step === 'ask_name') {
        data.name = text;
        this.userStates.set(chatId, { step: 'ask_email', data });
        await this.sendTelegramMessage(chatId, 'What is your email?');
      } else if (step === 'ask_email') {
        data.email = text;
        this.userStates.set(chatId, { step: 'ask_message', data });
        await this.sendTelegramMessage(chatId, 'What is your message?');
      } else if (step === 'ask_message') {
        data.message = text;
        this.userStates.delete(chatId);

        const contact = await this.createContact(data as Contact);
        await this.sendTelegramMessage(
          chatId,
          'Thank you! Your message has been saved.',
        );

        const adminMessage = `📩 New Contact:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
        await this.sendMessageToTelegram(adminMessage);
      }
    } catch (error) {
      console.error('Error handling Telegram message:', error.message);
    }
  }

  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    try {
      const chatId = callbackQuery?.message?.chat?.id;
      if (!chatId) return;

      const data = callbackQuery?.data;

      if (data === 'contact_us') {
        await this.sendTelegramMessage(
          chatId,
          'Please enter your name, email, and message.',
        );
      } else if (data === 'help') {
        await this.sendTelegramMessage(chatId, 'Type your message for admin.');
      }
    } catch (error) {
      console.error('Error handling callback query:', error.message);
    }
  }

  private async sendTelegramMessage(
    chatId: string,
    text: string,
  ): Promise<void> {
    try {
      const url = `${this.getTelegramApiUrl()}/sendMessage`;
      const payload = { chat_id: chatId, text };
      await axios.post(url, payload);
    } catch (error) {
      console.error(
        'Error sending message:',
        error?.response?.data || error.message,
      );
    }
  }

  public async sendMessageToTelegram(message: string): Promise<void> {
    try {
      const url = `${this.getTelegramApiUrl()}/sendMessage`;
      const payload = { chat_id: this.adminChatId, text: message };
      await axios.post(url, payload);
    } catch (error) {
      console.error(
        'Error sending admin message:',
        error?.response?.data || error.message,
      );
    }
  }

  private async createContact(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    return newContact.save();
  }
}
