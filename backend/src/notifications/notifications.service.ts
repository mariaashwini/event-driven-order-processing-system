import { Injectable, Logger } from '@nestjs/common';
import { OrderConfirmedEvent, OrderFailedEvent } from 'src/events/order.events';
import { EVENTS } from '../common/constants/event-names';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

@OnEvent(EVENTS.ORDER_CONFIRMED)
async handleOrderConfirmed(event: OrderConfirmedEvent) {
  const { orderId, customerEmail } = event;

  try {
    // success log
    this.logger.log(
      `Email sent to ${customerEmail}: Your order #${orderId} is confirmed`,
    );
  } catch (error) {
    // failure log
    this.logger.error(
      `Failed to send confirmation email to ${customerEmail} for order #${orderId}: ${error.message}`,
    );
  }
}

@OnEvent(EVENTS.ORDER_FAILED)
async handleOrderFailed(event: OrderFailedEvent) {
  const { orderId, customerEmail, reason } = event;

  try {

    // success log
    this.logger.log(
      `Email sent to ${customerEmail}: Your order #${orderId} failed - ${reason}`,
    );
  } catch (error) {
    // failure log
    this.logger.error(
      `Failed to send failure email to ${customerEmail} for order #${orderId}: ${error.message}`,
    );
  }
}

}
