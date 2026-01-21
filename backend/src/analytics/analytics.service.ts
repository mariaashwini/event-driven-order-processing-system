import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderStatus } from '../common/enums/order-status.enum';
import { EVENTS } from '../common/constants/event-names';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  // Cached analytics (derived from DB)
  private totalOrders = 0;
  private totalRevenue = '0';

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Recalculate analytics when order is confirmed
   */
  @OnEvent(EVENTS.ORDER_CONFIRMED)
  async handleOrderConfirmedEvent() {
    await this.refreshAnalytics();
    this.logger.log(
      `Analytics updated → orders=${this.totalOrders}, revenue=${this.totalRevenue}`,
    );
  }

  /**
   * Read analytics from DB
   */
  private async refreshAnalytics() {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(order.totalAmount), 0)', 'totalRevenue')
      .where('order.status = :status', {
        status: OrderStatus.CONFIRMED,
      })
      .getRawOne();

    this.totalOrders = Number(result.totalOrders);
    this.totalRevenue = result.totalRevenue;
  }

  async getStats() {
    await this.refreshAnalytics();

    return {
      totalOrders: this.totalOrders,
      totalRevenue: this.totalRevenue,
    };
  }
}
