import express from "express";
import cors from "cors";
import { products } from "./products.js";
import { queryProducts, getCategories } from "./query.js";
import { HttpError } from "./errors.js";
import { register, login, userForToken, endSession } from "./auth.js";
import { createOrder, ordersForUser, findOrder } from "./orders.js";

const app = express();
app.use(cors());
app.use(express.json());

// Simulated latency so loading states are visible during development.
app.use((_req, _res, next) => setTimeout(next, Number(process.env.API_DELAY_MS ?? 250)));

const bearer = (req) => (req.headers.authorization ?? "").replace(/^Bearer /, "");
app.use((req, _res, next) => {
  req.token = bearer(req);
  req.user = userForToken(req.token);
  next();
});
const requireUser = (req, _res, next) =>
  req.user ? next() : next(new HttpError(401, "Please sign in to continue."));

// ---- products ----
app.get("/api/products", (req, res) => {
  res.json({ ...queryProducts(products, req.query), categories: getCategories(products) });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) throw new HttpError(404, "Product not found");
  res.json(product);
});

// ---- auth ----
app.post("/api/auth/register", (req, res) => res.status(201).json(register(req.body)));
app.post("/api/auth/login", (req, res) => res.json(login(req.body)));
app.post("/api/auth/logout", (req, res) => {
  endSession(req.token);
  res.status(204).end();
});

// ---- orders ----
app.post("/api/orders", (req, res) => {
  res.status(201).json(createOrder(req.body, products, req.user?.id ?? null));
});
app.get("/api/orders", requireUser, (req, res) => res.json(ordersForUser(req.user.id)));
app.get("/api/orders/:id", (req, res) => {
  const order = findOrder(req.params.id);
  const allowed = order && (order.userId === null || order.userId === req.user?.id);
  if (!allowed) throw new HttpError(404, "Order not found");
  res.json(order);
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status ?? 500;
  res.status(status).json({ message: err.status ? err.message : "Something went wrong" });
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
