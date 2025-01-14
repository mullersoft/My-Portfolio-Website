// D:\web D\portfolio-website\server\src\modules\contact\frontend\frontend.module.ts
import { Module } from '@nestjs/common';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
