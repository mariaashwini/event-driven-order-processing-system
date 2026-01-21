import { Injectable, Logger } from '@nestjs/common';
import { OrderConfirmedEvent, OrderFailedEvent } from 'src/events/order.events';
import { EVENTS } from '../common/constants/event-names';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @OnEvent(EVENTS.ORDER_CONFIRMED)
  async handleOrderConfirmed(event: OrderConfirmedEvent) {
    const { customerEmail, orderId } = event;
    this.logger.log(
      `Email sent to ${customerEmail}: Your order #${orderId} is confirmed`,
    );
  }

  @OnEvent(EVENTS.ORDER_FAILED)
  async handleOrderFailed(event: OrderFailedEvent) {
    const { customerEmail, orderId, reason } = event;
    this.logger.log(
      `Email sent to ${customerEmail}: Your order #${orderId} failed - ${reason}`,
    );
  }
}
