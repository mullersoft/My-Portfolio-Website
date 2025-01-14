// src/modules/contact/frontend/frontend.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../contact.schema';
import { BotService } from '../bot/bot.service';

@Injectable()
export class FrontendService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private readonly botService: BotService, // Inject BotService
  ) {}

  async create(contact: Contact): Promise<Contact> {
    const newContact = new this.contactModel(contact);
    const savedContact = await newContact.save();

    // Optionally, notify the bot
    await this.botService.sendMessageToTelegram(
      `New contact created:\nName: ${savedContact.name}\nEmail: ${savedContact.email}\nMessage: ${savedContact.message}`,
    );

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }
}
