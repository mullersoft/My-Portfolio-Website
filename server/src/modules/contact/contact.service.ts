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

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private getTelegramCallbackUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;
  }

  private getTelegramMenuUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}/setMyCommands`;
  }

  private userStates = new Map<
    string,
    { step: string; data: Partial<Contact>; language: string }
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

  async sendMainMenu(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Welcome! Choose an option:',
      reply_markup: {
        keyboard: [['Change Language', 'Contact Admin'], ['Restart Bot']],
        one_time_keyboard: true,
      },
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'start_contact') {
      this.userStates.set(chatId, {
        step: 'ask_name',
        data: {},
        language: 'English',
      });
      await this.sendTelegramMessage(chatId, 'What is your name?');
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

    const { step, data, language } = userState;

    if (step === 'ask_name') {
      data.name = text;
      this.userStates.set(chatId, { step: 'ask_email', data, language });
      await this.sendTelegramMessage(chatId, 'What is your email?');
    } else if (step === 'ask_email') {
      data.email = text;
      this.userStates.set(chatId, { step: 'ask_message', data, language });
      await this.sendTelegramMessage(chatId, 'What is your message?');
    } else if (step === 'ask_message') {
      data.message = text;
      this.userStates.delete(chatId);

      const contact = await this.create(data as Contact);
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been saved.',
      );
    } else if (text === 'Change Language') {
      await this.sendLanguageSelection(chatId);
    } else if (text === 'Contact Admin') {
      await this.sendTelegramMessage(
        chatId,
        'Please type your message for the admin.',
      );
      this.userStates.set(chatId, {
        step: 'contact_admin',
        data: {},
        language,
      });
    } else if (text === 'Restart Bot') {
      await this.sendTelegramMessage(chatId, 'Restarting bot...');
      await this.sendMainMenu(chatId);
    } else if (userState.step === 'contact_admin') {
      await this.sendMessageToTelegram(`Message from ${chatId}: ${text}`);
      await this.sendTelegramMessage(
        chatId,
        'Your message has been sent to the admin.',
      );
      this.userStates.delete(chatId);
      await this.sendMainMenu(chatId);
    }
  }

  async sendLanguageSelection(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Please choose a language:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Amharic', callback_data: 'language_amharic' }],
          [{ text: 'English', callback_data: 'language_english' }],
        ],
      },
    };

    await axios.post(url, data);
  }

  async handleLanguageSelection(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'language_amharic') {
      this.userStates.get(chatId).language = 'Amharic';
      await this.sendTelegramMessage(chatId, 'ቋንቋውን እንደ አማርኛ ተመርጠዋል።');
    } else if (callbackData === 'language_english') {
      this.userStates.get(chatId).language = 'English';
      await this.sendTelegramMessage(chatId, 'Language set to English.');
    }

    await this.sendMainMenu(chatId);
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
    const data = { chat_id: this.chatId, text: message };

    await axios.post(url, data);
  }
}
