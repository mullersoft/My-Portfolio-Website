// D:\web D\portfolio-website\server\src\modules\contact\frontend\frontend.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { Contact } from '../contact.schema';

@Controller('contact/frontend')
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Post()
  async create(@Body() contact: Contact): Promise<Contact> {
    return this.frontendService.create(contact);
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.frontendService.findAll();
  }
}
