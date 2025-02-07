import { Controller, Post, Get, Body } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { Contact } from '../contact.schema';
import { CreateContactDto } from '../dto/create-contact.dto';

@Controller('contact/frontend')
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.frontendService.create(createContactDto);
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.frontendService.findAll();
  }
}
