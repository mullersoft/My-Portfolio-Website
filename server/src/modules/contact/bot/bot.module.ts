// src/modules/contact/bot/bot.module.ts
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  providers: [BotService],
  exports: [BotService], // Export the service so other modules can use it
})
export class BotModule {}
