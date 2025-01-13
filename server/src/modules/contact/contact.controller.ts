// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { ContactService } from './contact.service';
// import { Contact } from './contact.schema';

// @Controller('contact')
// export class ContactController {
//   constructor(private readonly contactService: ContactService) {}

//   @Get()
//   async findAll(): Promise<Contact[]> {
//     return this.contactService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<Contact> {
//     return this.contactService.findOne(id);
//   }

//   @Post()
//   async create(@Body() contact: Contact): Promise<Contact> {
//     return this.contactService.create(contact);
//   }

//   @Put(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() contact: Partial<Contact>,
//   ): Promise<Contact> {
//     return this.contactService.update(id, contact);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string): Promise<Contact> {
//     return this.contactService.delete(id);
//   }

//   @Post('telegram-webhook')
//   async handleTelegramWebhook(@Body() update: any): Promise<any> {
//     if (update.message) {
//       await this.contactService.handleTelegramMessage(update);
//     } else if (update.callback_query) {
//       await this.contactService.handleCallbackQuery(update.callback_query);
//     }
//     return { success: true };
//   }
// }
