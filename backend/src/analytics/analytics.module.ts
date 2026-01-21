import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../database/entities/order.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [AnalyticsService],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {}
