import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "../api/account";
import { useCart } from "../store/cart";
import { useAuth } from "../store/auth";
import { shippingFor } from "../lib";
import type { Customer } from "../types";
import OrderSummary from "../components/OrderSummary";

const FIELDS: [keyof Customer, string][] = [
  ["name", "Full name"],
  ["email", "Email"],
  ["address", "Address"],
  ["city", "City"],
  ["postcode", "Postcode"],
  ["country", "Country"],
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);

  const [form, setForm] = useState<Customer>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postcode: "",
    country: "Germany",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});

  const order = useMutation({
    mutationFn: placeOrder,
    onSuccess: (created) => {
      navigate(`/orders/${created.id}`, { state: { placed: true } });
      clear();
    },
  });

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <div className="state">
        <h2>Your bag is empty</h2>
        <p>Add an item before checking out.</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    FIELDS.forEach(([key]) => {
      if (!form[key].trim()) found[key] = "Required";
    });
    if (!found.email && !/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    order.mutate({
      customer: form,
      items: lines.map((l) => ({ productId: l.productId, size: l.size, quantity: l.quantity })),
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form onSubmit={submit} noValidate className="form">
          <h2>Delivery details</h2>
          {FIELDS.map(([key, label]) => (
            <label key={key} className="field">
              {label}
              <input
                value={form[key]}
                aria-invalid={Boolean(errors[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
              {errors[key] && <span className="error">{errors[key]}</span>}
            </label>
          ))}
          {order.isError && <p className="error" role="alert">{order.error.message}</p>}
          <button className="btn" type="submit" disabled={order.isPending}>
            {order.isPending ? "Placing order…" : "Place order"}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Your order</h2>
          <ul className="mini-lines">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`}>
                {l.quantity} × {l.name} ({l.size})
              </li>
            ))}
          </ul>
          <OrderSummary subtotal={subtotal} shipping={shipping} total={subtotal + shipping} />
        </aside>
      </div>
    </div>
  );
}
