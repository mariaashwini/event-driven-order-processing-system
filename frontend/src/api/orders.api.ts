import { api } from './http';
import type { Order, CreateOrder } from '../types/order';


/**
 * Create Order
 */
export const createOrder = (payload: CreateOrder) => {
  return api<Order>('/orders', {
    method: 'POST',
    body: payload,
  });
};

/**
 * Get all orders
 */
export const getOrders = (): Promise<Order[]> => {
  return api('/orders');
};

/**
 * Get order by ID
 */
export const getOrderById = (orderId: number): Promise<Order> => {
  return api(`/orders/${orderId}`);
};
