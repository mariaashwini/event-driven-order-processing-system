//Order related events

export class OrderCreatedEvent {
  orderId: number;
  // customerEmail: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  // totalAmount: number;
}

export class OrderConfirmedEvent {
  orderId: number;
  customerEmail: string;
  totalAmount: number;
}

export class OrderFailedEvent {
  orderId: number;
  customerEmail: string;
  reason: string;
}

export class OrderItemEvent {
  productId: number;
  quantity: number;
}
