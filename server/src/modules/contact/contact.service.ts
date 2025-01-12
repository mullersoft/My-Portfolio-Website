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

    return; // return the deleted contact or appropriate response
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

  async sendMainMenu(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Choose an option:',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Menu Option 1', callback_data: 'option_1' },
            { text: 'Menu Option 2', callback_data: 'option_2' },
          ],
          [
            { text: 'Contact Us', callback_data: 'contact_us' },
            { text: 'Help', callback_data: 'help' },
          ],
        ],
      },
    };

    await axios.post(url, data);
  }

  async sendCustomKeyboard(chatId: string): Promise<void> {
    const url = this.getTelegramApiUrl();
    const data = {
      chat_id: chatId,
      text: 'Choose an option:',
      reply_markup: {
        keyboard: [
          ['Menu Option 1', 'Menu Option 2'],
          ['Contact Us', 'Help'],
        ],
        one_time_keyboard: false, // Makes the keyboard persistent
      },
    };

    await axios.post(url, data);
  }

  async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    switch (callbackData) {
      case 'option_1':
        await this.sendTelegramMessage(chatId, 'You selected Option 1');
        break;
      case 'option_2':
        await this.sendTelegramMessage(chatId, 'You selected Option 2');
        break;
      case 'contact_us':
        await this.sendTelegramMessage(
          chatId,
          'Contact us at support@example.com',
        );
        break;
      case 'help':
        await this.sendTelegramMessage(
          chatId,
          'Here is how you can use the bot...',
        );
        break;
      default:
        await this.sendTelegramMessage(chatId, 'Invalid option');
    }
  }

  async handleTelegramMessage(update: any): Promise<void> {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    console.log(`Received message: ${text} from chat: ${chatId}`);

    const userState = this.userStates.get(chatId);

    if (!userState) {
      console.log(
        `No state found for chat: ${chatId}. Sending contact button.`,
      );
      await this.sendContactButton(chatId);
      return;
    }

    const { step, data } = userState;

    console.log(`Current step: ${step}, Data: ${JSON.stringify(data)}`);

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
