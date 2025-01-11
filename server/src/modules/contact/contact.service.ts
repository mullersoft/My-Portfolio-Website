import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;

  private getTelegramApiUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  async findOne(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec();
  }

  async create(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    const savedContact = await newContact.save();

    const telegramMessage = `📬 New Contact Message:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
    await this.sendMessageToTelegram(telegramMessage);

    return savedContact;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, contact, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Contact> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }

  private async sendMessageToTelegram(message: string): Promise<void> {
    try {
      await axios.post(
        this.getTelegramApiUrl(),
        {
          chat_id: this.chatId,
          text: message,
        },
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      console.error(
        'Error sending message to Telegram:',
        error.response?.data || error.message,
      );
    }
  }

  // New method to handle Telegram webhook
  async handleTelegramMessage(telegramMessage: any): Promise<Contact> {
    const { text, from } = telegramMessage.message;
    const contactInfo = this.parseTelegramMessage(text);

    const newContact = new this.contactModel({
      name: from.first_name || 'Unknown',
      email: contactInfo.email || 'N/A',
      message: contactInfo.message || text,
    });

    return newContact.save();
  }

  private parseTelegramMessage(message: string): {
    email?: string;
    message?: string;
  } {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const email = message.match(emailRegex)?.[0];
    const content = message.replace(email || '', '').trim();
    return { email, message: content };
  }
}
