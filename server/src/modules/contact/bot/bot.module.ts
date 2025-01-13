import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { Contact, ContactSchema } from '../contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
