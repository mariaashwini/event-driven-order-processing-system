import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders.api";
import { getProducts } from "../api/products.api";
import type { Product } from "../types/products";

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
};

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load products
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Add item
  const addItem = () => {
    if (!selectedProductId) {
      setErrors({ product: "Please select a product" });
      return;
    }
    if (quantity < 1) {
      setErrors({ quantity: "Quantity must be at least 1" });
      return;
    }

    setErrors({}); // clear errors
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id,
      );

      //  If item already exists → increase quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id ?
            { ...item, quantity: item.quantity + quantity }
          : item,
        );
      }

      //  If item does not exist → add new
      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
        },
      ];
    });

    setSelectedProductId("");
    setQuantity(1);
  };

  //Remove Item
  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Called when selecting a product
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number(e.target.value);

    const product = products.find((p) => p.id === productId);

    // Safety check: block out-of-stock selection
    if (product && product.stockQuantity === 0) {
      return;
    }

    setSelectedProductId(productId);
  };

  // Validation logic

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }

    if (items.length === 0) {
      newErrors.items = "Please add at least one product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit order
  const submitOrder = async () => {
    if (!validate()) return;

    await createOrder({
      customerName,
      customerEmail,
      totalAmount,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });
    navigate("/orders");
  };

  return (
    <div className="container">
      <h2>Create Order</h2>

      <div className="form-group">
        <label>Name</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        {errors.customerName && (
          <p className="text-error">{errors.customerName}</p>
        )}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        {errors.customerEmail && (
          <p className="text-error">{errors.customerEmail}</p>
        )}
      </div>

      <div className="form-group">
        <label>Product</label>
        <select value={selectedProductId} onChange={handleProductChange}>
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id} disabled={p.stockQuantity === 0}>
              {p.name} - ₹{p.price}{" "}
              {p.stockQuantity === 0 ?
                " (Out of Stock)"
              : ` (Stock: ${p.stockQuantity})`}
            </option>
          ))}
        </select>
        {errors.product && <p className="text-error">{errors.product}</p>}
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        {errors.quantity && (
          <p className="text-error">{errors.quantity
          }</p>
        )}
      </div>

      <button className="btn-primary" onClick={addItem}>
        Add Item
      </button>

      <hr />

      <ul className="list">
        {items.map((item, index) => (
          <li className="list-item" key={index}>
            {item.productName} * {item.quantity} = ₹{item.price * item.quantity}
            <button className="btn-danger" onClick={() => removeItem(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {errors.items && <p className="text-error">{errors.items}</p>}

      <div className="total">
        <strong>Total: ₹{totalAmount}</strong>
      </div>

      <br />

      <button className="btn-primary" onClick={submitOrder}>
        Submit Order
      </button>
    </div>
  );
}
