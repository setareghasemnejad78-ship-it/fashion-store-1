import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import { FREE_SHIPPING_FROM, formatPrice, shippingFor } from "../lib";
import OrderSummary from "../components/OrderSummary";

export default function CartPage() {
  const { lines, setQuantity, remove } = useCart();
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <div className="state">
        <h2>Your bag is empty</h2>
        <p>Add something you like and it will show up here.</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Bag</h1>
      <div className="cart-layout">
        <ul className="cart-lines">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="cart-line">
              <div className="cart-thumb" style={{ background: l.colorHex }} aria-hidden="true" />
              <div className="cart-info">
                <Link to={`/product/${l.productId}`}><strong>{l.name}</strong></Link>
                <p className="muted">{l.brand} · Size {l.size}</p>
                <div className="qty">
                  <button aria-label={`Decrease quantity of ${l.name}`} onClick={() => setQuantity(l.productId, l.size, l.quantity - 1)}>−</button>
                  <span data-testid={`qty-${l.productId}-${l.size}`}>{l.quantity}</span>
                  <button aria-label={`Increase quantity of ${l.name}`} onClick={() => setQuantity(l.productId, l.size, l.quantity + 1)}>+</button>
                  <button className="link-btn" onClick={() => remove(l.productId, l.size)}>Remove</button>
                </div>
              </div>
              <p>{formatPrice(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <OrderSummary subtotal={subtotal} shipping={shipping} total={subtotal + shipping} />
          {shipping > 0 && (
            <p className="muted">Add {formatPrice(FREE_SHIPPING_FROM - subtotal)} more for free shipping.</p>
          )}
          <Link to="/checkout" className="btn block">Go to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
