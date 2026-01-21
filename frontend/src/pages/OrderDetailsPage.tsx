import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOrderById } from "../api/orders.api";
import type { Order } from "../types/order";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getOrderById(Number(id))
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center">Loading order...</p>;
  if (error) return <p className="text-error">{error}</p>;
  if (!order) return <p className="text-center">Order not found</p>;

  return (
    <div className="container">
      <h2>Order #{order.id}</h2>

      <div className="order-meta">
        <p>
          <b>Status:</b> {order.status}
        </p>
        <p>
          <b>Total:</b> ₹{order.totalAmount}
        </p>
      </div>

      <h4 className="section-title">Items</h4>

      <div className="table-container">
        <table className="details-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price (₹)</th>
              <th>Total Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.priceAtPurchase}</td>
                <td>₹{Number(item.priceAtPurchase) * Number(item.quantity)}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
