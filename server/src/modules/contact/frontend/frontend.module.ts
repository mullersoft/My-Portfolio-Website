import { Module } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    BotModule,
  ],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
