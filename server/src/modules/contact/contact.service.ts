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
        'Welcome! I am a Web Developer, Telegram Bot Developer, and Chatbot Developer. How can I assist you today?',
      );
      return;
    } else if (text === '/help') {
      // Save the state to expect a message from the user
      this.userStates.set(chatId, { step: 'send_to_admin', data: {} });
      await this.sendTelegramMessage(
        chatId,
        'Please type your message for the admin, and I will forward it to @mulersoft.',
      );
      return;
    }

    // Handle user input for the admin message
    const userState = this.userStates.get(chatId);

    if (userState?.step === 'send_to_admin') {
      this.userStates.delete(chatId); // Clear the state after receiving the message

      // Forward the message to the admin
      const adminChatId = '@mulersoft'; // Replace with the actual admin chat ID or username
      const messageForAdmin = `📩 Message from User:\n\nChat ID: ${chatId}\nMessage: ${text}`;
      await this.sendTelegramMessage(adminChatId, messageForAdmin);

      // Confirm to the user
      await this.sendTelegramMessage(
        chatId,
        'Thank you! Your message has been sent to the admin.',
      );
      return;
    }

    // Fallback: If no specific state or command matches
    await this.sendTelegramMessage(
      chatId,
      'I didn’t understand that. Use /start to learn about me or /help to contact the admin.',
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
    const data = { chat_id: this.chatId, text: message };

    await axios.post(url, data);
  }
}
