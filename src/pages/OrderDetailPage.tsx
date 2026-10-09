import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "../api/account";
import { formatDate, formatPrice } from "../lib";
import OrderSummary from "../components/OrderSummary";
import { ErrorState } from "../components/States";

export default function OrderDetailPage() {
  const { id = "" } = useParams();
  const placed = (useLocation().state as { placed?: boolean } | null)?.placed;
  const { data: order, isPending, isError, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
  });

  if (isPending) return <p className="state" aria-busy="true">Loading order…</p>;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div>
      {placed && (
        <div className="banner" role="status">
          <h2>Thank you, your order is placed</h2>
          <p>We sent a confirmation to {order.customer.email}.</p>
        </div>
      )}
      <h1>Order {order.id}</h1>
      <p className="muted">
        {formatDate(order.createdAt)} · <span className="status">{order.status}</span>
      </p>

      <div className="cart-layout">
        <ul className="cart-lines">
          {order.lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="cart-line">
              <div className="cart-thumb" style={{ background: l.colorHex }} aria-hidden="true" />
              <div className="cart-info">
                <strong>{l.name}</strong>
                <p className="muted">{l.brand} · Size {l.size} · Qty {l.quantity}</p>
              </div>
              <p>{formatPrice(l.unitPrice * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <aside className="cart-summary">
          <OrderSummary subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
          <h3>Delivery address</h3>
          <address>
            {order.customer.name}<br />
            {order.customer.address}<br />
            {order.customer.postcode} {order.customer.city}<br />
            {order.customer.country}
          </address>
        </aside>
      </div>
      <p><Link to="/account">Back to account</Link></p>
    </div>
  );
}
