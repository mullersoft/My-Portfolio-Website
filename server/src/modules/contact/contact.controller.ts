import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.schema';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactService.findOne(id);
  }

  @Post()
  async create(@Body() contact: Contact): Promise<Contact> {
    return this.contactService.create(contact);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() contact: Partial<Contact>,
  ): Promise<Contact> {
    return this.contactService.update(id, contact);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Contact> {
    return this.contactService.delete(id);
  }

  // Webhook endpoint for Telegram
  @Post('telegram-webhook')
  async handleTelegramWebhook(@Body() update: any): Promise<any> {
    console.log('Received Telegram update:', update);

    // Check if the update contains a message
    if (!update.message) {
      console.error('Invalid Telegram update format:', update);
      return { success: false, message: 'Invalid Telegram update format' };
    }

    try {
      const contact = await this.contactService.handleTelegramMessage(update);
      return { success: true, data: contact };
    } catch (error) {
      console.error('Error handling Telegram webhook:', error);
      return { success: false, message: 'Error handling Telegram webhook' };
    }
  }
}
