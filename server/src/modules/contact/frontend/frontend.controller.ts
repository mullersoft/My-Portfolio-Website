import { Controller, Post, Body } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { Contact } from '../contact.schema';

@Controller('frontend')
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Post('contact')
  async createContact(@Body() contact: Partial<Contact>): Promise<Contact> {
    return this.frontendService.createContact(contact);
  }
}
