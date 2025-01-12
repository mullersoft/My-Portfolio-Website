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

  // async sendContactButton(chatId: string): Promise<void> {
  //   const url = this.getTelegramApiUrl();
  //   const data = {
  //     chat_id: chatId,
  //     text: 'Click the button below to contact us:',
  //     reply_markup: {
  //       inline_keyboard: [
  //         [{ text: 'Contact Us', callback_data: 'start_contact' }],
  //       ],
  //     },
  //   };

  //   await axios.post(url, data);
  // }
  async sendContactButton(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Welcome! Choose an option below:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Contact Us', callback_data: 'start_contact' }],
          [{ text: 'Change Language', callback_data: 'change_language' }],
          [{ text: 'Contact Admin', callback_data: 'contact_admin' }],
        ],
      },
    };

    await axios.post(url, data);
  }
  async setupTelegramMenu(): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/setMyCommands`;
    const commands = [
      { command: '/start', description: 'Start the bot' },
      { command: '/change_language', description: 'Change language' },
      { command: '/contact_admin', description: 'Contact admin' },
    ];

    await axios.post(url, { commands });
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'start_contact') {
      this.userStates.set(chatId, { step: 'ask_name', data: {} });
      await this.sendTelegramMessage(chatId, 'What is your name?');
    } else if (callbackData === 'change_language') {
      const url = this.getTelegramApiUrl();
      const data = {
        chat_id: chatId,
        text: 'Please select your preferred language:',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Amharic', callback_data: 'set_language_amharic' }],
            [{ text: 'English', callback_data: 'set_language_english' }],
          ],
        },
      };
      await axios.post(url, data);
    } else if (callbackData === 'set_language_amharic') {
      await this.sendTelegramMessage(chatId, 'Language changed to Amharic.');
    } else if (callbackData === 'set_language_english') {
      await this.sendTelegramMessage(chatId, 'Language changed to English.');
    } else if (callbackData === 'contact_admin') {
      const adminChatId = this.chatId; // Replace with your chat ID
      const message = `User @${query.from.username} wants to contact you.`;
      await this.sendTelegramMessage(adminChatId, message);
      await this.sendTelegramMessage(chatId, 'The admin has been notified.');
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
