import { Link, Route, Routes } from "react-router-dom";
import { useCart } from "./store/cart";
import { useWishlist } from "./store/wishlist";
import { useAuth } from "./store/auth";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import OrderDetailPage from "./pages/OrderDetailPage";

export default function App() {
  const count = useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const saved = useWishlist((s) => s.items.length);
  const user = useAuth((s) => s.user);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">
          Linea
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link to="/wishlist">Wishlist ({saved})</Link>
          <Link to="/account">{user ? user.name.split(" ")[0] : "Sign in"}</Link>
          <Link to="/bag" className="bag-link" aria-label={`Bag, ${count} items`}>
            Bag <span className="bag-count">{count}</span>
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/bag" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="*" element={<p className="state">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
