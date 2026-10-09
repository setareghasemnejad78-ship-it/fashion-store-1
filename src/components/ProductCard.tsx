import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../lib";
import { useWishlist } from "../store/wishlist";

export default function ProductCard({ product }: { product: Product }) {
  const saved = useWishlist((s) => s.items.some((p) => p.id === product.id));
  const toggle = useWishlist((s) => s.toggle);
  const onSale = product.originalPrice !== null;

  return (
    <article className="card" data-testid="product-card">
      <button
        className={`heart ${saved ? "saved" : ""}`}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        onClick={() => toggle(product)}
      >
        {saved ? "♥" : "♡"}
      </button>
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="swatch" style={{ background: product.colorHex }} aria-hidden="true">
          {onSale && <span className="sale-tag">Sale</span>}
        </div>
        <p className="card-brand">{product.brand}</p>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-price">
          <span>{formatPrice(product.price)}</span>
          {onSale && <s className="was">{formatPrice(product.originalPrice!)}</s>}
        </p>
      </Link>
    </article>
  );
}
