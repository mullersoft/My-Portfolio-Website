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

  async sendContactButton(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Welcome! Please choose an option:',
      reply_markup: {
        keyboard: [
          [{ text: 'Contact Us' }],
          [{ text: 'Change Language' }],
          [{ text: 'Contact Admin' }],
          [{ text: 'Restart Bot' }],
        ],
        resize_keyboard: true,
      },
    };

    await axios.post(url, data);
  }

  async setupTelegramMenu(): Promise<void> {
    const url = this.getTelegramMenuUrl();
    const data = {
      commands: [
        { command: '/start', description: 'Start the Bot' },
        { command: '/language', description: 'Change Language' },
        { command: '/contact_admin', description: 'Contact Admin' },
        { command: '/restart', description: 'Restart Bot' },
      ],
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
      await this.sendContactButton(chatId);
      return;
    }

    const { step, data, language } = userState;

    if (text === 'Change Language') {
      this.userStates.set(chatId, { step: 'ask_language', data, language });
      await this.sendTelegramMessage(
        chatId,
        'Please choose a language: Amharic or English',
      );
    } else if (text === 'Contact Admin') {
      this.userStates.set(chatId, { step: 'ask_message', data, language });
      await this.sendTelegramMessage(
        chatId,
        'Please type your message to send to the admin.',
      );
    } else if (text === 'Restart Bot') {
      this.userStates.delete(chatId);
      await this.sendTelegramMessage(chatId, 'Bot is restarting...');
      await this.sendContactButton(chatId);
    } else if (step === 'ask_language') {
      if (text === 'Amharic' || text === 'English') {
        this.userStates.set(chatId, { step: 'ask_name', data, language: text });
        await this.sendTelegramMessage(
          chatId,
          `You selected ${text} language.`,
        );
        await this.sendTelegramMessage(chatId, 'What is your name?');
      } else {
        await this.sendTelegramMessage(
          chatId,
          'Invalid language. Please choose either Amharic or English.',
        );
      }
    } else if (step === 'ask_name') {
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
    const data = { chat_id: this.chatId, text: message };

    await axios.post(url, data);
  }
}
