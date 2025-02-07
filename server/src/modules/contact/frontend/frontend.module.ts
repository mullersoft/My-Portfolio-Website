import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';
import { BotModule } from '../bot/bot.module';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    BotModule, // Import BotModule
  ],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
