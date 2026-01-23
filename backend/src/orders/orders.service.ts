import { Injectable, BadRequestException, Logger, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { Product } from '../database/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { EVENTS } from '../common/constants/event-names';

import {
  InventoryReservedEvent,
  InventoryFailedEvent,
} from '../events/inventory.events';
import { OrderItemEvent } from 'src/events/order.events';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private eventEmitter: EventEmitter2,
  ) {}

 async createOrder(dto: CreateOrderDto) {
  return this.dataSource.transaction(async (manager) => {
    let calculatedTotal = 0;

    const orderItems: OrderItem[] = [];
    const eventItems: { productId: number; quantity: number }[] = [];

    for (const item of dto.items) {
      // 1. Validate productId
      const product = await manager.findOne(Product, {
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(
          `Invalid productId ${item.productId}`,
        );
      }

      // 2. Calculate price from DB
      const itemTotal = Number(product.price) * item.quantity;
      calculatedTotal += itemTotal;

      // 3. Prepare order_items
      orderItems.push(
        manager.create(OrderItem, {
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price, // snapshot
        }),
      );

      // 4. Prepare inventory event data
      eventItems.push({
        productId: product.id,
        quantity: item.quantity,
      });
    }

    // 5. Validate totalAmount sent by client
    if (Number(dto.totalAmount) !== Number(calculatedTotal)) {
      throw new BadRequestException(
        `Total amount mismatch. Expected ${calculatedTotal}, received ${dto.totalAmount}`,
      );
    }

    // 6. Create order (PENDING)
    const order = manager.create(Order, {
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      totalAmount: calculatedTotal, // backend truth
      status: OrderStatus.PENDING,
    });

    const savedOrder = await manager.save(order);

    // 7. Save order_items
    for (const item of orderItems) {
      item.orderId = savedOrder.id;
      await manager.save(item);
    }

    // 8. Emit OrderCreatedEvent
    this.eventEmitter.emit(EVENTS.ORDER_CREATED, {
      orderId: savedOrder.id,
      // customerEmail: savedOrder.customerEmail,
      items: eventItems,
      // totalAmount: calculatedTotal,
    });

    return savedOrder;
  });
}

  @OnEvent(EVENTS.INVENTORY_RESERVED)
async handleInventoryReserved(event: InventoryReservedEvent) {
  const { orderId } = event;

  try {
    // 1. Fetch order
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    // Safety check (event may be delayed or duplicated)
    if (!order) {
      this.logger.warn(
        `Order not found for INVENTORY_RESERVED event. orderId=${orderId}`,
      );
      return;
    }

    // Idempotency check
    if (order.status === OrderStatus.CONFIRMED) {
      this.logger.warn(
        `Order ${orderId} already CONFIRMED. Skipping duplicate event.`,
      );
      return;
    }

    // 2. Update status
    order.status = OrderStatus.CONFIRMED;
    await this.orderRepo.save(order);

    this.logger.log(`Order confirmed for orderId=${orderId}`);

    // 3. Emit next event
    this.eventEmitter.emit(EVENTS.ORDER_CONFIRMED, {
      orderId: order.id,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    this.logger.error(
      `Error handling INVENTORY_RESERVED for orderId=${orderId}`,
      error.stack,
    );
  }
}


 @OnEvent(EVENTS.INVENTORY_FAILED)
async handleInventoryFailed(event: InventoryFailedEvent) {
  const { orderId, reason } = event;

  try {
    // 1. Fetch order
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      this.logger.warn(
        `Order not found for INVENTORY_FAILED event. orderId=${orderId}`,
      );
      return;
    }

    // Idempotency check
    if (order.status === OrderStatus.FAILED) {
      this.logger.warn(
        `Order ${orderId} already FAILED. Skipping duplicate event.`,
      );
      return;
    }

    // 2. Update status
    order.status = OrderStatus.FAILED;
    await this.orderRepo.save(order);

    this.logger.log(`Order failed for orderId=${orderId}`);

    // 3. Emit failure event
    this.eventEmitter.emit(EVENTS.ORDER_FAILED, {
      orderId: order.id,
      customerEmail: order.customerEmail,
      reason,
    });
  } catch (error) {
    this.logger.error(
      `Error handling INVENTORY_FAILED for orderId=${orderId}`,
      error.stack,
    );
  }
}


  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async getOrderById(orderId: number) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: {
      items: {
        product: true,
      },
    },
  });

  if (!order) {
    throw new NotFoundException(`Order ${orderId} not found`);
  }

  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    })),
  };
}
}
