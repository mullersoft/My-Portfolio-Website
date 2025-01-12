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
    // Implement the update logic here
    return {} as Contact; // Replace with actual implementation
  }

  async delete(id: string): Promise<Contact> {
    // Implement the delete logic here
    return {} as Contact; // return the deleted contact or appropriate response
  }

  async sendMenuButton(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Welcome to our bot! Choose an option:',
      reply_markup: {
        keyboard: [
          [
            { text: 'Start the bot' },
            { text: 'Change language' },
            { text: 'Contact admin' },
          ],
        ],
        resize_keyboard: true, // Makes the keyboard a bit smaller
        one_time_keyboard: true, // Closes the keyboard after selection
      },
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
    console.log('Callback Query:', query); // Add this line for debugging
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'start_contact') {
      this.userStates.set(chatId, { step: 'ask_name', data: {} });
      await this.sendTelegramMessage(chatId, 'What is your name?');
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    console.log(`Received message: ${text} from chat: ${chatId}`);

    const userState = this.userStates.get(chatId);

    if (!userState) {
      console.log(`No state found for chat: ${chatId}. Sending menu button.`);
      await this.sendMenuButton(chatId);
      return;
    }

    const { step, data } = userState;

    console.log(`Current step: ${step}, Data: ${JSON.stringify(data)}`);

    // Handle menu options
    if (text === 'Start the bot') {
      await this.sendTelegramMessage(
        chatId,
        'Welcome to the bot! How can I assist you today?',
      );
      this.userStates.set(chatId, { step: 'start_bot', data: {} });
    } else if (text === 'Change language') {
      await this.sendTelegramMessage(
        chatId,
        'Please select a language:\n1. English\n2. Español',
      );
      this.userStates.set(chatId, { step: 'change_language', data: {} });
    } else if (text === 'Contact admin') {
      await this.sendTelegramMessage(
        chatId,
        'Please wait while I connect you to the admin...',
      );
      // Optionally, send a message to the admin
      await this.sendMessageToTelegram(
        `User ${chatId} wants to contact the admin.`,
      );
    } else if (step === 'ask_name') {
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
      console.log(`Saved contact: ${JSON.stringify(contact)}`);
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
