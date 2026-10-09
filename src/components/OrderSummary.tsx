import { formatPrice } from "../lib";

interface Props {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, total }: Props) {
  return (
    <dl className="summary">
      <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
      <div className="total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
    </dl>
  );
}
