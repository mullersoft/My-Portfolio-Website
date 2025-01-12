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

  private userStates = new Map<
    string,
    { step: string; language: string; data: Partial<Contact> }
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

    switch (callbackData) {
      case 'change_language':
        await this.sendLanguageSelection(chatId);
        break;

      case 'contact_admin':
        this.userStates.set(chatId, {
          step: 'ask_message',
          language: 'English',
          data: {},
        });
        await this.sendTelegramMessage(
          chatId,
          'Type your message for the admin:',
        );
        break;

      case 'restart_bot':
        this.userStates.delete(chatId);
        await this.sendWelcomeMessage(chatId);
        break;

      case 'language_amharic':
        this.userStates.set(chatId, {
          step: '',
          language: 'Amharic',
          data: {},
        });
        await this.sendTelegramMessage(chatId, 'ቋንቋ እንደ አማርኛ ተመርጧል።');
        break;

      case 'language_english':
        this.userStates.set(chatId, {
          step: '',
          language: 'English',
          data: {},
        });
        await this.sendTelegramMessage(chatId, 'Language set to English.');
        break;
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    const userState = this.userStates.get(chatId);

    if (!userState) {
      await this.sendWelcomeMessage(chatId);
      return;
    }

    const { step, data } = userState;

    if (step === 'ask_message') {
      data.message = text;
      this.userStates.delete(chatId);

      await this.sendMessageToTelegram(`Message from user: ${text}`);
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been sent to the admin.',
      );
    }
  }

  async sendWelcomeMessage(chatId: string): Promise<void> {
    const message = `👋 Welcome! I am a Web Developer, Chatbot Developer, and Telegram Bot Developer.\n\nUse the "Menu" button to see available options.`;
    const replyMarkup = {
      inline_keyboard: [[{ text: 'Menu', callback_data: 'show_menu' }]],
    };
    await this.sendTelegramMessage(chatId, message, replyMarkup);
  }

  async sendLanguageSelection(chatId: string): Promise<void> {
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: 'Amharic', callback_data: 'language_amharic' },
          { text: 'English', callback_data: 'language_english' },
        ],
      ],
    };
    await this.sendTelegramMessage(
      chatId,
      'Select your preferred language:',
      replyMarkup,
    );
  }

  private async sendTelegramMessage(
    chatId: string,
    text: string,
    replyMarkup?: any,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: chatId, text, reply_markup: replyMarkup };

    await axios.post(url, data);
  }

  private async sendMessageToTelegram(message: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: this.chatId, text: message };

    await axios.post(url, data);
  }
}
