// server/src/modules/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

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
    return newContact.save();
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
}
