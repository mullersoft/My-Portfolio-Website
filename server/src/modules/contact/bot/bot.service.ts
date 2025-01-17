import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  private readonly botToken = process.env.BOT_TOKEN; // Use environment variable for bot token
  private readonly adminChatId = process.env.CHAT_ID; // Use environment variable for admin chat ID

  private getTelegramApiUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}`;
  }

  private userStates = new Map<
    string,
    { step: string; data: Partial<Contact> }
  >();

  async onModuleInit() {
    // Set webhook when the bot service is initialized
    await this.setWebhook();
  }

  private async setWebhook(): Promise<void> {
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

    const url = `${this.getTelegramApiUrl()}/setWebhook?url=${webhookUrl}`;

    try {
      await axios.get(url);
      console.log('Webhook set successfully!');
    } catch (error) {
      console.error('Error setting webhook:', error);
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    switch (text) {
      case '/start':
        this.userStates.delete(chatId);
        await this.sendTelegramMessage(
          chatId,
          'Welcome! Use /contact to send us a message, or /help for assistance.',
        );
        return;

      case '/help':
        this.userStates.delete(chatId);
        await this.sendTelegramMessage(
          chatId,
          'How can we assist you? Use /contact to send us a message or ask specific questions.',
        );
        return;

      case '/contact':
        this.userStates.set(chatId, { step: 'ask_name', data: {} });
        await this.sendTelegramMessage(chatId, 'What is your name?');
        return;

      default:
        break;
    }

    const userState = this.userStates.get(chatId);
    if (!userState) {
      await this.sendTelegramMessage(
        chatId,
        'Please use a valid command: /start, /contact, or /help.',
      );
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

      // Save the contact data to MongoDB
      const contact = await this.createContact(data as Contact);
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been saved and sent to the admin.',
      );

      // Send the contact data to the admin
      const adminMessage = `📩 New Contact Message:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
      await this.sendMessageToTelegram(adminMessage);
    }
  }

  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'contact_us') {
      await this.sendTelegramMessage(
        chatId,
        'Please enter your name, email, and message.',
      );
    } else if (data === 'help') {
      await this.sendTelegramMessage(
        chatId,
        'Please type your message for the admin.',
      );
    }
  }

  private async sendTelegramMessage(
    chatId: string,
    text: string,
  ): Promise<void> {
    const url = this.getTelegramApiUrl();
    const payload = { chat_id: chatId, text };
    await axios.post(url, payload);
  }

  public async sendMessageToTelegram(message: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const payload = { chat_id: this.adminChatId, text: message };
    await axios.post(url, payload);
  }

  private async createContact(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    return newContact.save();
  }
}
