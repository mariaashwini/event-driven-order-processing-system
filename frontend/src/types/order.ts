// src/types/order.ts

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'FAILED';


  export interface CreateOrder {
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: CreateOrderItem[];
}

/**
 * Order (used in Orders List & Order Detail)
 */
export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string; // DECIMAL → string
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;

  // Present only in order detail API
  items: OrderItem[];
}


/**
* items when creatig order
**/

export interface CreateOrderItem{
productId: number;
  quantity: number;
}
/**
 * 
 * Order Item (used in Order Detail page)
 */
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: string; // DECIMAL → string
  createdAt?: string;
}

