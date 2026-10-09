import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, login, logout, register } from "../api/account";
import { useAuth } from "../store/auth";
import { formatDate, formatPrice } from "../lib";
import { ErrorState } from "../components/States";

function AuthForm() {
  const setSession = useAuth((s) => s.setSession);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useMutation({
    mutationFn: () => (mode === "login" ? login({ email, password }) : register({ name, email, password })),
    onSuccess: (session) => setSession(session.token, session.user),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    auth.mutate();
  };

  return (
    <form onSubmit={submit} className="form narrow">
      <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
      {mode === "register" && (
        <label className="field">
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
      )}
      <label className="field">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </label>
      <label className="field">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      {auth.isError && <p className="error" role="alert">{auth.error.message}</p>}
      <button className="btn" type="submit" disabled={auth.isPending}>
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        className="link-btn"
        onClick={() => {
          auth.reset();
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}

function OrderHistory() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isPending) return <p className="state" aria-busy="true">Loading your orders…</p>;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (data.length === 0) {
    return (
      <div className="state">
        <h3>No orders yet</h3>
        <p>When you place an order, it will appear here.</p>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <ul className="orders">
      {data.map((o) => (
        <li key={o.id}>
          <Link to={`/orders/${o.id}`} className="order-row">
            <span><strong>{o.id}</strong><br /><span className="muted">{formatDate(o.createdAt)}</span></span>
            <span>{o.lines.reduce((sum, l) => sum + l.quantity, 0)} items</span>
            <span className="status">{o.status}</span>
            <span>{formatPrice(o.total)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AccountPage() {
  const user = useAuth((s) => s.user);
  const clearSession = useAuth((s) => s.clear);
  const queryClient = useQueryClient();

  if (!user) return <AuthForm />;

  const signOut = async () => {
    await logout().catch(() => undefined);
    clearSession();
    queryClient.removeQueries({ queryKey: ["orders"] });
  };

  return (
    <div>
      <div className="account-head">
        <div>
          <h1>Hello, {user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <button className="btn secondary" onClick={signOut}>Sign out</button>
      </div>
      <h2>Order history</h2>
      <OrderHistory />
    </div>
  );
}
