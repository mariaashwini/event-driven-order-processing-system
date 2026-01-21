import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/orders/new">Create Order</NavLink> |
      <NavLink to="/orders">Orders</NavLink> |
      <NavLink to="/analytics/stats">Analytics</NavLink> |
    </nav>
  );
}
