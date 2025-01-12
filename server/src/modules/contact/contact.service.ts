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

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private getTelegramCallbackUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;
  }

  private userStates = new Map<
    string,
    { step: string; data: Partial<Contact> }
  >();

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
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(
        id,
        contact,
        { new: true }, // This option returns the updated document
      )
      .exec();

    if (!updatedContact) {
      throw new Error(`Contact with ID ${id} not found.`);
    }

    return updatedContact;
  }

  async delete(id: string): Promise<Contact> {
    const deletedContact = await this.contactModel.findByIdAndDelete(id).exec();

    if (!deletedContact) {
      throw new Error(`Contact with ID ${id} not found.`);
    }

    return deletedContact;
  }

  async sendMenu(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Choose an option:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Start the Bot', callback_data: 'start_bot' }],
          [{ text: 'Change Language', callback_data: 'change_language' }],
          [{ text: 'Contact Admin', callback_data: 'contact_admin' }],
        ],
      },
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'start_bot') {
      await this.sendTelegramMessage(chatId, 'Bot started successfully!');
    } else if (callbackData === 'change_language') {
      await this.sendTelegramMessage(
        chatId,
        'Please select your preferred language:',
      );
      // Add language selection logic if needed
    } else if (callbackData === 'contact_admin') {
      await this.sendTelegramMessage(
        chatId,
        'You can contact the admin at admin@example.com.',
      );
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === '/start') {
      await this.sendMenu(chatId);
    } else {
      await this.sendTelegramMessage(
        chatId,
        "I didn't understand that. Please use the menu.",
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

  private async sendMessageToTelegram(message: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: process.env.CHAT_ID, text: message };

    await axios.post(url, data);
  }
}
