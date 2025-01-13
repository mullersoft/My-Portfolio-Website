import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private userStates = new Map<
    string,
    { step: string; data: Partial<Contact> }
  >();

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === '/start') {
      this.userStates.delete(chatId);
      await this.sendTelegramMessage(
        chatId,
        'Welcome! Use /contact to send us a message, or /help for assistance.',
      );
      return;
    } else if (text === '/contact') {
      this.userStates.set(chatId, { step: 'ask_name', data: {} });
      await this.sendTelegramMessage(chatId, 'What is your name?');
      return;
    }

    const userState = this.userStates.get(chatId);
    if (!userState) {
      await this.sendTelegramMessage(
        chatId,
        'Please select a command: /start, /contact, or /help.',
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

      try {
        const contact = await this.create(data as Contact);
        await this.sendTelegramMessage(
          chatId,
          `Thank you! Your message has been saved:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`,
        );
      } catch (error) {
        await this.sendTelegramMessage(
          chatId,
          'An error occurred while saving your message. Please try again later.',
        );
      }
    }
  }

  // Handle callback queries (e.g., button clicks)
  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'contact_us') {
      await this.sendTelegramMessage(
        chatId,
        'Please enter your name, email, and message.',
      );
    } else if (data === 'help') {
      await this.sendTelegramMessage(
        chatId,
        'Please type your message for the admin:',
      );
    }
  }

  private async sendTelegramMessage(
    chatId: string,
    text: string,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: chatId, text };
    await axios.post(url, data);
  }

  private async sendMessageToTelegram(
    message: string,
    chatId: string,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: chatId, text: message };
    await axios.post(url, data);
  }

  private async create(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    return newContact.save();
  }
}
