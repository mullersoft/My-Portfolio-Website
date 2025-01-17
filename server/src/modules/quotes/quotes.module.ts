import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()], // Import ScheduleModule for cron jobs
  providers: [QuotesService],
  exports: [QuotesService],
  controllers: [QuotesController],
})
export class QuotesModule {}
