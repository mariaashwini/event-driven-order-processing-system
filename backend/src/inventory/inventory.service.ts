import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

import { Product } from '../database/entities/product.entity';
import { EVENTS } from '../common/constants/event-names';

import { OrderCreatedEvent } from '../events/order.events';

@Injectable()
export class InventoryService {
   private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}


   @OnEvent(EVENTS.ORDER_CREATED)
  async handleOrderCreated(event: OrderCreatedEvent) {
    // 1. Check stock for all items
    // 2. If sufficient: reduce stock, emit InventoryReservedEvent
    // 3. If insufficient: emit InventoryFailedEvent
 this.logger.log(`Inventory check started for order ${event.orderId}`);

    try {
      await this.dataSource.transaction(async (manager) => {
        //  Check stock for ALL items
        for (const item of event.items) {
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
            lock: { mode: 'pessimistic_write' }, // prevent race conditions
          });

          if (!product || product.stockQuantity < item.quantity) {
            throw new Error(
              `Insufficient stock for product ${item.productId}`,
            );
          }
        }

        //  Reduce stock (only if all checks passed)
        for (const item of event.items) {
          await manager.decrement(
            Product,
            { id: item.productId },
            'stockQuantity',
            item.quantity,
          );
        }
      });

      //  Emit inventory reserved (AFTER commit)
      this.logger.log(`Inventory reserved for order ${event.orderId}`);

      this.eventEmitter.emit(EVENTS.INVENTORY_RESERVED, {
        orderId: event.orderId,
      });
    } catch (error) {
      // 4️⃣ Emit inventory failed
      this.logger.error(
        `Inventory failed for order ${event.orderId}`,
        error.message,
      );

      this.eventEmitter.emit(EVENTS.INVENTORY_FAILED, {
        orderId: event.orderId,
        reason: error.message,
      });
    }
  }
}