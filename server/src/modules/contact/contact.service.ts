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
      // Start the contact flow
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
      await this.sendTelegramMessage(
        chatId,
        'Welcome! I am Mulugeta Linger, a web, Telegram bot, and chatbot developer. Feel free to interact with me!',
      );
      return;
    } else if (text === '/help') {
      this.userStates.set(chatId, { step: 'help_message', data: {} });
      await this.sendTelegramMessage(
        chatId,
        'Type your message for the admin, and I will forward it to @mulersoft.',
      );
      return;
    }

    // Handle user input for the help message flow
    const userState = this.userStates.get(chatId);

    if (userState?.step === 'help_message') {
      this.userStates.delete(chatId); // Clear state after receiving the message

      // Forward the user's message to your account
      const adminMessage = `📩 New message from user:\n\n${text}`;
      await this.sendMessageToTelegram(adminMessage); // Sends to your account using `CHAT_ID`

      await this.sendTelegramMessage(
        chatId,
        'Your message has been sent to the admin. Thank you!',
      );
      return;
    }

    // Default fallback if no specific command or flow is matched
    await this.sendTelegramMessage(
      chatId,
      'I did not understand that. Use /start to learn about me or /help to send a message to the admin.',
    );
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
    const data = { chat_id: this.chatId, text: message }; // Use your admin chat ID here

    await axios.post(url, data);
  }
}
