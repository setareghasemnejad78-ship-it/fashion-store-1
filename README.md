# Linea – Fashion Store

A production-style fashion e-commerce front end built with React, TypeScript and a small REST API.

**Features:** product catalog, search, filtering, sorting, pagination, product details, wishlist, bag, checkout with validation, user accounts, order history, loading / error / empty states, unit and end-to-end tests, CI.

## Stack
React 18 · TypeScript · Vite · React Router · TanStack Query · Zustand · Express · Vitest + Testing Library · Playwright

## Run it
```bash
npm install
npm run dev        # web on :5173, API on :4000
npm test           # unit tests
npx playwright install chromium && npm run e2e
```

## API
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/products` | `q`, `category`, `size`, `maxPrice`, `sort` (`price-asc`, `price-desc`, `rating`), `page`, `pageSize` |
| GET | `/api/products/:id` | 404 with `{ message }` if not found |

## Decisions
- Filters live in the URL, so every result page is shareable and the back button works.
- Search is debounced; the previous results stay visible while new ones load.
- Server query logic is a pure function and unit-tested separately from Express.

## More API
| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Returns `{ token, user }`; passwords hashed with scrypt |
| POST | `/api/auth/logout` | Ends the session |
| POST | `/api/orders` | Prices the order on the server from the catalog; client prices are ignored |
| GET | `/api/orders` | Order history of the signed-in user |
| GET | `/api/orders/:id` | Order detail (guest orders by id, user orders by owner) |

Data is kept in memory for the demo, so it resets when the API restarts. Swap `server/orders.js` and `server/auth.js` for a database to go further.

## Roadmap
- [ ] Persistent database (PostgreSQL)
- [ ] Payment provider integration
- [ ] Product images and i18n (EN/DE)
