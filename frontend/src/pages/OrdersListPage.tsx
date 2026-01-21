import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders.api";
import StatusBadge from "../components/StatusBadge";
import type { Order } from "../types/order";

/*  COMPONENT  */

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="container">
      <h2>Orders</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/orders/${order.id}`}>{order.id}</Link>
                </td>
                <td>{order.customerName}</td>
                <td>₹{order.totalAmount}</td>
                <td className="status-cell">
                  <StatusBadge status={order.status} />
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
