// server/src/modules/contact/contact.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.schema';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Get all contacts
  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  // Get a single contact by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactService.findOne(id);
  }

  // Create a new contact
  @Post()
  async create(@Body() contact: Contact): Promise<Contact> {
    return this.contactService.create(contact);
  }

  // Update a contact by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() contact: Partial<Contact>,
  ): Promise<Contact> {
    return this.contactService.update(id, contact);
  }

  // Delete a contact by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Contact> {
    return this.contactService.delete(id);
  }
}
