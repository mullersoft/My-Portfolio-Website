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

    // Send the contact data to the bot (admin)
    const adminMessage = `📩 New Contact Message:\n\nName: ${savedContact.name}\nEmail: ${savedContact.email}\nMessage: ${savedContact.message}`;
    await this.botService.sendMessageToTelegram(adminMessage);

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }
}
