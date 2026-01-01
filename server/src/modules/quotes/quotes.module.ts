import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [QuotesService],
  controllers: [QuotesController],
})
export class QuotesModule {}
