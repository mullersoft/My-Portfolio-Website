import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';
import axios from 'axios';

@Injectable()
export class ContactService {
  private userStates = new Map<string, { step: string; data: any }>();

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    const userState = this.userStates.get(chatId);

    if (!userState) {
      await this.sendContactButton(chatId);
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

      // Use Partial<Contact> to create the contact
      const contact = await this.create(data as Partial<Contact>);
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been saved.',
      );
    }
  }

  async create(contact: Partial<Contact>): Promise<Contact> {
    // Create a new Mongoose document
    const newContact = new this.contactModel(contact);
    return newContact.save();
  }

  private async sendContactButton(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Please provide your name to start.',
    };

    this.userStates.set(chatId, { step: 'ask_name', data: {} });
    await axios.post(url, data);
  }

  private async sendTelegramMessage(
    chatId: string,
    text: string,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: chatId, text };

    await axios.post(url, data);
  }

  private getTelegramApiUrl(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    return `https://api.telegram.org/bot${token}/sendMessage`;
  }
}
