// src/modules/contact/bot/bot.module.ts
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService], // Export BotService
})
export class BotModule {}
