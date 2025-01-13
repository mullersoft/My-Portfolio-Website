import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';
import { Contact, ContactSchema } from '../contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
