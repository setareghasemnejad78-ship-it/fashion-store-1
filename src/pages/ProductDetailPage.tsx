import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../api/products";
import { useCart } from "../store/cart";
import { useWishlist } from "../store/wishlist";
import { formatPrice } from "../lib";
import { ErrorState } from "../components/States";

export default function ProductDetailPage() {
  const { id = "" } = useParams();
  const add = useCart((s) => s.add);
  const toggleSaved = useWishlist((s) => s.toggle);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);

  const { data: product, isPending, isError, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });
  const saved = useWishlist((s) => s.items.some((p) => String(p.id) === id));

  if (isPending) return <p className="state" aria-busy="true">Loading product…</p>;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="detail">
      <Link to="/" className="back">
        Back to all products
      </Link>
      <div className="detail-grid">
        <div className="detail-swatch" style={{ background: product.colorHex }} aria-hidden="true" />
        <div>
          <p className="card-brand">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="card-price large">
            <span>{formatPrice(product.price)}</span>
            {product.originalPrice !== null && <s className="was">{formatPrice(product.originalPrice)}</s>}
          </p>
          <p>{product.description}</p>
          <p className="muted">Colour: {product.color} · Rated {product.rating}/5</p>

          <fieldset>
            <legend>Select a size</legend>
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`chip ${size === s ? "active" : ""}`}
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setAdded(false);
                }}
              >
                {s}
              </button>
            ))}
          </fieldset>

          <div className="actions">
            <button
              className="btn"
              disabled={!size}
              onClick={() => {
                add({
                  productId: product.id,
                  size,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  colorHex: product.colorHex,
                });
                setAdded(true);
              }}
            >
              Add to bag
            </button>
            <button className="btn secondary" aria-pressed={saved} onClick={() => toggleSaved(product)}>
              {saved ? "Saved to wishlist" : "Save to wishlist"}
            </button>
          </div>
          {!size && <p className="muted">Choose a size to add this item.</p>}
          {added && (
            <p role="status">
              Added to your bag. <Link to="/bag">View bag</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
