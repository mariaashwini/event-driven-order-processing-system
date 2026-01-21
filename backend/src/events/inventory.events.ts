export class InventoryReservedEvent {
  orderId: number;
}

export class InventoryFailedEvent {
  orderId: number;
  reason: string;
}
