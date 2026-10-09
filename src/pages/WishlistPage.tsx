import { Link } from "react-router-dom";
import { useWishlist } from "../store/wishlist";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);

  return (
    <div>
      <h1>Wishlist</h1>
      {items.length === 0 ? (
        <div className="state">
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on any product to save it for later.</p>
          <Link to="/" className="btn">Browse products</Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
