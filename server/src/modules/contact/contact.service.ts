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
  private readonly adminTelegramHandle = '@mulersoft';

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
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
    return this.contactModel
      .findByIdAndUpdate(id, contact, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Contact> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'select_language') {
      await this.sendLanguageOptions(chatId);
    } else if (callbackData === 'amharic' || callbackData === 'english') {
      const language = callbackData === 'amharic' ? 'Amharic' : 'English';
      await this.sendTelegramMessage(chatId, `Language set to ${language}.`);
    } else if (callbackData === 'contact_admin') {
      this.userStates.set(chatId, { step: 'ask_message', data: {} });
      await this.sendTelegramMessage(
        chatId,
        'Type your message for the admin:',
      );
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    const userState = this.userStates.get(chatId);

    if (!userState) {
      await this.sendMainMenu(chatId);
      return;
    }

    const { step } = userState;

    if (step === 'ask_message') {
      this.userStates.delete(chatId);
      const message = `📩 Message from user:\n\n${text}`;
      await this.sendMessageToTelegram(message);
      await this.sendTelegramMessage(
        chatId,
        'Your message has been sent to the admin.',
      );
    }
  }

  async sendMainMenu(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Welcome! Please select an option:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Change Language', callback_data: 'select_language' }],
          [{ text: 'Contact Admin', callback_data: 'contact_admin' }],
        ],
      },
    };

    await axios.post(url, data);
  }

  async sendLanguageOptions(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Select your preferred language:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Amharic', callback_data: 'amharic' }],
          [{ text: 'English', callback_data: 'english' }],
        ],
      },
    };

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

  private async sendMessageToTelegram(message: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: this.adminTelegramHandle, text: message };

    await axios.post(url, data);
  }
}
