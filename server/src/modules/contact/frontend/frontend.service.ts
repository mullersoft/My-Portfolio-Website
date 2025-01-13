import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FrontendService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  async createContact(contact: Partial<Contact>): Promise<Contact> {
    const savedContact = await this.contactModel.create(contact);

    const telegramMessage = `📬 New Contact Message from Frontend:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
    await this.sendMessageToTelegram(telegramMessage);

    return savedContact;
  }

  private async sendMessageToTelegram(text: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    await axios.post(url, { chat_id: this.chatId, text });
  }
}
