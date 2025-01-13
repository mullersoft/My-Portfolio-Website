import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import axios from 'axios';
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

  async handleTelegramMessage(message: any): Promise<void> {
    const contact = {
      name: message.name || 'Unknown',
      email: message.email || 'Unknown',
      message: message.text,
    };

    await this.contactModel.create(contact);

    const telegramMessage = `📬 New Contact Message from Telegram Bot:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
    await this.sendMessageToTelegram(telegramMessage);
  }

  private async sendMessageToTelegram(text: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    await axios.post(url, { chat_id: this.chatId, text });
  }
}
