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
  private readonly adminChatId = process.env.ADMIN_CHAT_ID; // Admin's chat ID

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
    await this.sendMessageToTelegram(telegramMessage, this.chatId);

    return savedContact;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    return {} as Contact; // Replace with actual implementation
  }

  async delete(id: string): Promise<Contact> {
    return {} as Contact; // return the deleted contact or appropriate response
  }

  async sendContactButton(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Click the button below to contact us:',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Contact Us', callback_data: 'start_contact' }],
        ],
      },
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
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

    // Handle specific commands
    if (text === '/start') {
      // Reset user state and send welcome message
      this.userStates.delete(chatId);
      await this.sendTelegramMessage(
        chatId,
        'Welcome! Use /contact to send us a message, or /help for assistance.',
      );
      return;
    } else if (text === '/help') {
      // Set the state to collect a message for the admin
      this.userStates.set(chatId, { step: 'ask_admin_message', data: {} });
      await this.sendTelegramMessage(
        chatId,
        'Please type your message for the admin:',
      );
      return;
    } else if (text === '/contact') {
      // Start the contact flow
      this.userStates.set(chatId, { step: 'ask_name', data: {} });
      await this.sendTelegramMessage(chatId, 'What is your name?');
      return;
    }

    // Handle user input based on state
    const userState = this.userStates.get(chatId);

    if (!userState) {
      console.log(
        `No state found for chat: ${chatId}. Sending default message.`,
      );
      await this.sendTelegramMessage(
        chatId,
        'Please select a command from the menu: /start, /contact, or /help.',
      );
      return;
    }

    const { step, data } = userState;

    console.log(`Current step: ${step}, Data: ${JSON.stringify(data)}`);

    // Handle different steps
    if (step === 'ask_admin_message') {
      // Send the user's message to the admin's Telegram account
      const adminMessage = `📩 Message for Admin:\n\nFrom Chat ID: ${chatId}\nMessage: ${text}`;
      await this.sendMessageToTelegram(adminMessage, '@mulersoft');
      this.userStates.delete(chatId);
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been sent to the admin.',
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

  private async sendMessageToTelegram(
    message: string,
    recipient: string,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = { chat_id: recipient, text: message };

    try {
      await axios.post(url, data);
      console.log(`Message sent to ${recipient}: ${message}`);
    } catch (error) {
      console.error(`Failed to send message to ${recipient}:`, error.message);
    }
  }
}
