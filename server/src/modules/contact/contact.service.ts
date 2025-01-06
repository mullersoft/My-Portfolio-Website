import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';
import axios from 'axios';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  // Load bot token and chat ID from environment variables
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;

  private getTelegramApiUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  // Find all contacts
  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  // Find a single contact by ID
  async findOne(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec();
  }

  // Create a new contact
  async create(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    const savedContact = await newContact.save();

    // Send message to Telegram
    const telegramMessage = `📬 New Contact Message:\n\nName: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`;
    await this.sendMessageToTelegram(telegramMessage);

    return savedContact;
  }

  // Update an existing contact by ID
  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, contact, { new: true })
      .exec();
  }

  // Delete a contact by ID
  async delete(id: string): Promise<Contact> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }

  // Helper method to send messages to Telegram
  private async sendMessageToTelegram(message: string): Promise<void> {
    try {
      await axios.post(this.getTelegramApiUrl(), {
        chat_id: this.chatId,
        text: message,
      });
    } catch (error) {
      console.error(
        'Error sending message to Telegram:',
        error.response?.data || error.message,
      );
    }
  }
}
