import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contact.schema';
import { CreateContactDto } from '../dto/create-contact.dto';
import { BotService } from '../bot/bot.service';

@Injectable()
export class FrontendService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly botService: BotService, // Inject BotService
  ) {}

  async create(contactDto: CreateContactDto): Promise<Contact> {
    try {
      const newContact = new this.contactModel(contactDto);
      const savedContact = await newContact.save();

      // Notify Telegram bot
      await this.botService.sendMessageToTelegram(
        `New contact created:\nName: ${savedContact.name}\nEmail: ${savedContact.email}\nMessage: ${savedContact.message}`,
      );

      return savedContact;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw new InternalServerErrorException('Failed to save contact');
    }
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }
}
