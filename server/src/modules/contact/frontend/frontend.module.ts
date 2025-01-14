// src/modules/contact/frontend/frontend.module.ts
import { Module } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';
import { BotModule } from '../bot/bot.module'; // Import the BotModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    BotModule, // Add BotModule to imports
  ],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
