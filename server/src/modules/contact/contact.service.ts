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
        inline_keyboard: [
          [
            { text: 'Restart Bot', callback_data: 'restart_bot' },
            { text: 'Change Language', callback_data: 'change_language' },
            { text: 'Contact Admin', callback_data: 'contact_admin' },
          ],
        ],
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
      ],
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'restart_bot') {
      await this.sendTelegramMessage(chatId, 'Bot is restarting...');
      await this.sendContactButton(chatId); // Restart the menu
    } else if (callbackData === 'change_language') {
      this.userStates.set(chatId, {
        step: 'select_language',
        data: {},
        language: '',
      });
      await this.sendTelegramMessage(
        chatId,
        'Please select a language:\n1. Amharic\n2. English',
      );
    } else if (callbackData === 'contact_admin') {
      this.userStates.set(chatId, {
        step: 'ask_message',
        data: {},
        language: '',
      });
      await this.sendTelegramMessage(
        chatId,
        'Please type your message to the admin.',
      );
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

    const { step, data } = userState;

    if (step === 'select_language') {
      if (text === '1') {
        this.userStates.set(chatId, {
          step: 'ask_message',
          data,
          language: 'Amharic',
        });
        await this.sendTelegramMessage(
          chatId,
          'You selected Amharic. Now, please type your message.',
        );
      } else if (text === '2') {
        this.userStates.set(chatId, {
          step: 'ask_message',
          data,
          language: 'English',
        });
        await this.sendTelegramMessage(
          chatId,
          'You selected English. Now, please type your message.',
        );
      } else {
        await this.sendTelegramMessage(
          chatId,
          'Invalid option. Please choose 1 for Amharic or 2 for English.',
        );
      }
    } else if (step === 'ask_message') {
      data.message = text;
      const language = userState.language;
      this.userStates.delete(chatId);

      const contact = await this.create(data as Contact);
      await this.sendTelegramMessage(
        chatId,
        `Thank you! Your message has been sent in ${language}.`,
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
