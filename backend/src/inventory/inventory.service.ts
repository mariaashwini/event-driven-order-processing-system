import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

import { Product } from '../database/entities/product.entity';
import { EVENTS } from '../common/constants/event-names';
import { OrderCreatedEvent } from '../events/order.events';

class InsufficientStockError extends Error {
  constructor(public productId: number) {
    super(`Insufficient stock for product ${productId}`);
  }
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EVENTS.ORDER_CREATED)
  async handleOrderCreated(event: OrderCreatedEvent) {
    const orderId = event.orderId;

    this.logger.log(
      `[ORDER ${orderId}] START inventory check`,
    );

    try {
      await this.dataSource.transaction(async (manager) => {
        this.logger.log(
          `[ORDER ${orderId}] CHECK validating stock`,
        );

        for (const item of event.items) {
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!product || product.stockQuantity < item.quantity) {
            throw new InsufficientStockError(item.productId);
          }
        }

        this.logger.log(
          `[ORDER ${orderId}] UPDATE reducing stock`,
        );

        for (const item of event.items) {
          await manager.decrement(
            Product,
            { id: item.productId },
            'stockQuantity',
            item.quantity,
          );
        }
      });

      this.logger.log(
        `[ORDER ${orderId}] SUCCESS inventory reserved`,
      );

      this.eventEmitter.emit(EVENTS.INVENTORY_RESERVED, {
        orderId,
      });

      this.logger.log(
        `[ORDER ${orderId}] EMIT INVENTORY_RESERVED`,
      );
    } catch (error) {
      const reason =
        error instanceof InsufficientStockError
          ? `INSUFFICIENT_STOCK (product ${error.productId})`
          : 'INVENTORY_SERVICE_ERROR';

      this.logger.error(
        `[ORDER ${orderId}] FAIL inventory check → ${reason}`,
      );

      this.eventEmitter.emit(EVENTS.INVENTORY_FAILED, {
        orderId,
        reason,
      });

      this.logger.log(
        `[ORDER ${orderId}] EMIT INVENTORY_FAILED`,
      );
    }
  }
}