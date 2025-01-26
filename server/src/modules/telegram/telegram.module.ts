// telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import ConfigModule to access environment variables
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
