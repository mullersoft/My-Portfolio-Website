import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contact.schema';
import { CreateContactDto } from '../dto/create-contact.dto';
import { BotService } from '../bot/bot.service';

@Injectable()
export class FrontendService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly botService: BotService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const newContact = new this.contactModel(createContactDto);
    const savedContact = await newContact.save();

    try {
      await this.botService.sendMessageToTelegram(
        `New Contact Submitted:\nName: ${savedContact.name}\nEmail: ${savedContact.email}\nMessage: ${savedContact.message}`,
      );
    } catch (error) {
      console.error('Error sending notification to Telegram:', error);
    }

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }
}
